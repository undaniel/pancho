import * as vscode from 'vscode';
import { Commands } from './registry';
import { macroRecorder, MacroStep } from '../macro/recorder';
import { insertAtCursor } from '../utils/editor';

const STORAGE_KEY = 'pancho.macros';

function getSavedMacros(context: vscode.ExtensionContext): Record<string, MacroStep[]> {
    return context.globalState.get<Record<string, MacroStep[]>>(STORAGE_KEY, {});
}

async function play(steps: MacroStep[]): Promise<void> {
    macroRecorder.setPlaying(true);
    try {
        for (const step of steps) {
            if (step.type === 'command') {
                await vscode.commands.executeCommand(step.command);
            } else {
                await insertAtCursor(step.text);
            }
        }
    } finally {
        macroRecorder.setPlaying(false);
    }
}

export function registerMacroCommands(context: vscode.ExtensionContext): void {
    let lastMacro: MacroStep[] = [];

    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.MACRO_START, () => {
            if (macroRecorder.isPlaying()) {
                vscode.window.showWarningMessage(vscode.l10n.t('Pancho: Wait for playback to finish'));
                return;
            }
            macroRecorder.start();
            vscode.window.showInformationMessage(vscode.l10n.t('Pancho: Recording macro...'));
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.MACRO_STOP, () => {
            if (!macroRecorder.isRecording()) {
                vscode.window.showWarningMessage(vscode.l10n.t('Pancho: Not recording'));
                return;
            }
            lastMacro = macroRecorder.stop();
            vscode.window.showInformationMessage(vscode.l10n.t('Pancho: Macro recorded ({0} steps)', lastMacro.length));
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.MACRO_PLAY, async () => {
            if (macroRecorder.isRecording()) {
                vscode.window.showWarningMessage(vscode.l10n.t('Pancho: Stop the current recording first'));
                return;
            }
            if (macroRecorder.isPlaying()) {
                vscode.window.showWarningMessage(vscode.l10n.t('Pancho: Macro already playing'));
                return;
            }
            if (lastMacro.length === 0) {
                vscode.window.showWarningMessage(vscode.l10n.t('Pancho: No macro recorded'));
                return;
            }
            await play(lastMacro);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.MACRO_SAVE, async () => {
            if (lastMacro.length === 0) {
                vscode.window.showWarningMessage(vscode.l10n.t('Pancho: No macro recorded'));
                return;
            }
            const name = await vscode.window.showInputBox({ prompt: vscode.l10n.t('Macro name') });
            if (!name) return;
            const macros = getSavedMacros(context);
            macros[name] = lastMacro;
            await context.globalState.update(STORAGE_KEY, macros);
            vscode.window.showInformationMessage(vscode.l10n.t('Pancho: Saved macro: {0}', name));
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.MACRO_LOAD, async () => {
            const macros = getSavedMacros(context);
            const names = Object.keys(macros);
            if (names.length === 0) {
                vscode.window.showWarningMessage(vscode.l10n.t('Pancho: No saved macros'));
                return;
            }
            const pick = await vscode.window.showQuickPick(names, { placeHolder: vscode.l10n.t('Load macro') });
            if (!pick) return;
            lastMacro = macros[pick];
            vscode.window.showInformationMessage(vscode.l10n.t('Pancho: Loaded macro: {0}', pick));
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(Commands.MACRO_LIST, () => {
            const names = Object.keys(getSavedMacros(context));
            vscode.window.showInformationMessage(
                names.length > 0 ? vscode.l10n.t('Pancho: Saved macros: {0}', names.join(', ')) : vscode.l10n.t('Pancho: No saved macros')
            );
        })
    );
}
