import * as vscode from 'vscode';
import { Commands } from '../commands/registry';
import { ContentKind, detectContent } from '../transforms/detectContent';
import { t } from '../utils/i18n';

interface ActionSpec {
    command: string;
    title: string;
}

const SPECS: Record<ContentKind, ActionSpec[]> = {
    jwt: [
        { command: Commands.DECODE_JWT, title: t('Decode JWT') },
    ],
    json: [
        { command: Commands.PRETTIFY_JSON, title: t('Prettify JSON') },
        { command: Commands.MINIFY_JSON, title: t('Minify JSON') },
        { command: Commands.JSON_TO_CSV, title: t('JSON to CSV') },
    ],
    csv: [
        { command: Commands.CSV_TO_JSON, title: t('CSV to JSON') },
        { command: Commands.CSV_TO_MARKDOWN, title: t('CSV to Markdown table') },
    ],
    color: [
        { command: Commands.COLOR_INFO, title: t('Show color info') },
        { command: Commands.HEX_TO_RGB, title: t('Hex to RGB') },
    ],
    base64: [
        { command: Commands.BASE64_DECODE, title: t('Decode Base64') },
    ],
    timestamp: [
        { command: Commands.TIMESTAMP_TO_ISO, title: t('Timestamp to ISO') },
    ],
};

export function registerCodeActionsProvider(context: vscode.ExtensionContext): void {
    const provider: vscode.CodeActionProvider = {
        provideCodeActions(document, range) {
            if (range.isEmpty) return undefined;
            const text = document.getText(range);
            const kinds = detectContent(text);
            if (kinds.length === 0) return undefined;

            const actions: vscode.CodeAction[] = [];
            for (const kind of kinds) {
                for (const spec of SPECS[kind]) {
                    const action = new vscode.CodeAction(spec.title, vscode.CodeActionKind.Refactor);
                    action.command = { command: spec.command, title: spec.title };
                    actions.push(action);
                }
            }
            return actions;
        },
    };
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider('*', provider, {
            providedCodeActionKinds: [vscode.CodeActionKind.Refactor],
        })
    );
}
