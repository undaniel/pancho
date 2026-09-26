import * as vscode from 'vscode';
import { Commands } from './registry';
import { registerCommand } from '../utils/register';
import { t } from '../utils/i18n';
import { confirmWithPreview } from '../utils/preview';
import { replaceDocumentText } from '../utils/editor';
import { PIPELINE_STEPS, PipelineStep, pipelineStep, runPipelineSteps } from '../pipelines/catalog';
import { readPipelines, writePipelines, parsePipelines, SavedPipeline } from '../pipelines/store';

interface StepItem extends vscode.QuickPickItem {
    command?: string;
    done?: boolean;
    savedPipeline?: SavedPipeline;
    action?: 'export' | 'import' | 'delete';
}

async function pickNewPipeline(): Promise<string[] | undefined> {
    const steps: string[] = [];
    while (true) {
        const remaining = PIPELINE_STEPS.filter(step => !steps.includes(step.command));
        if (remaining.length === 0) break;

        const items: StepItem[] = [
            {
                label: `$(check) ${t('Done')}`,
                description: steps.length ? t('{0} step(s)', String(steps.length)) : undefined,
                done: true,
            },
            ...remaining.map(step => ({ label: t(step.label), command: step.command })),
        ];
        const picked = await vscode.window.showQuickPick<StepItem>(items, {
            title: t('Pipeline step {0}', String(steps.length + 1)),
            placeHolder: steps.length
                ? steps.map(id => t(pipelineStep(id)?.label ?? id)).join(' > ')
                : undefined,
        });
        if (!picked || picked.done) break;
        if (picked.command) steps.push(picked.command);
    }
    return steps.length ? steps : undefined;
}

async function applyPipeline(editor: vscode.TextEditor, stepIds: string[]): Promise<void> {
    const steps = stepIds
        .map(pipelineStep)
        .filter((step): step is PipelineStep => step !== undefined);
    if (steps.length === 0) {
        vscode.window.showWarningMessage(t('This pipeline has no valid steps'));
        return;
    }

    const target = editor.selection.isEmpty
        ? editor.document.getText()
        : editor.document.getText(editor.selection);
    const run = runPipelineSteps(target, steps);

    if (run.error) {
        const failedLabel = t(pipelineStep(run.failedAt ?? '')?.label ?? run.failedAt ?? '');
        vscode.window.showErrorMessage(t('Pipeline failed at {0}: {1}', failedLabel, run.error));
        return;
    }
    if (run.result === target) {
        vscode.window.showInformationMessage(t('The pipeline produced no changes'));
        return;
    }
    if (!(await confirmWithPreview(target, run.result, t('Pipeline')))) return;

    if (editor.selection.isEmpty) {
        await replaceDocumentText(() => run.result);
    } else {
        await editor.edit(builder => builder.replace(editor.selection, run.result));
    }
}

export function registerPipelineCommands(context: vscode.ExtensionContext): void {
    registerCommand(context, Commands.RUN_PIPELINE, async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage(t('Pancho: No active editor'));
            return;
        }

        const saved = readPipelines(context);
        const items: StepItem[] = [
            { label: `$(add) ${t('New pipeline...')}` },
            ...saved.map(pipeline => ({
                label: pipeline.name,
                description: t('{0} step(s)', String(pipeline.steps.length)),
                savedPipeline: pipeline,
            })),
        ];
        const picked = await vscode.window.showQuickPick<StepItem>(items, { title: t('Run pipeline') });
        if (!picked) return;

        let stepIds: string[] | undefined;
        if (picked.savedPipeline) {
            stepIds = picked.savedPipeline.steps;
        } else {
            stepIds = await pickNewPipeline();
            if (!stepIds) return;
            const name = await vscode.window.showInputBox({
                prompt: t('Save this pipeline as (leave empty to skip)'),
            });
            if (name) {
                const pipelines = saved.filter(pipeline => pipeline.name !== name);
                pipelines.push({ name, steps: stepIds });
                await writePipelines(context, pipelines);
            }
        }

        await applyPipeline(editor, stepIds);
    });

    registerCommand(context, Commands.MANAGE_PIPELINES, async () => {
        const saved = readPipelines(context);
        const items: StepItem[] = [
            { label: t('Export to clipboard'), action: 'export' },
            { label: t('Import from clipboard'), action: 'import' },
            ...saved.map(pipeline => ({
                label: `$(trash) ${pipeline.name}`,
                description: t('Delete'),
                action: 'delete' as const,
                savedPipeline: pipeline,
            })),
        ];
        const picked = await vscode.window.showQuickPick<StepItem>(items, { title: t('Manage pipelines') });
        if (!picked) return;

        if (picked.action === 'export') {
            await vscode.env.clipboard.writeText(JSON.stringify(saved, null, 2));
            vscode.window.showInformationMessage(t('Pipelines copied to the clipboard'));
            return;
        }

        if (picked.action === 'import') {
            const parsed = parsePipelines(await vscode.env.clipboard.readText());
            if (!parsed) {
                vscode.window.showErrorMessage(t('Invalid pipeline JSON'));
                return;
            }
            const merged = [...saved];
            for (const pipeline of parsed) {
                const index = merged.findIndex(item => item.name === pipeline.name);
                if (index >= 0) merged[index] = pipeline;
                else merged.push(pipeline);
            }
            await writePipelines(context, merged);
            vscode.window.showInformationMessage(t('{0} pipeline(s) imported', String(parsed.length)));
            return;
        }

        if (picked.action === 'delete' && picked.savedPipeline) {
            await writePipelines(context, saved.filter(item => item.name !== picked.savedPipeline!.name));
        }
    });
}
