import * as vscode from 'vscode';
import { t } from '../utils/i18n';

export interface SearchMatch {
    file: string;
    line: number;
    column: number;
    text: string;
}

export interface SearchResult {
    matches: SearchMatch[];
    error?: string;
    filesScanned?: number;
}

export async function findInFiles(pattern: string, options: { regex?: boolean; caseSensitive?: boolean; wholeWord?: boolean } = {}): Promise<SearchResult> {
    if (!pattern) return { matches: [], error: t('Empty pattern') };

    let regex: RegExp;
    try {
        const flags = options.caseSensitive ? 'g' : 'gi';
        const source = options.regex ? pattern : pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const wrapped = options.wholeWord ? `\\b${source}\\b` : source;
        regex = new RegExp(wrapped, flags);
    } catch (e) {
        return { matches: [], error: t('Invalid pattern') };
    }

    const files = await vscode.workspace.findFiles('**/*', '**/{node_modules,dist,.git,out,build}/**', 500);
    const matches: SearchMatch[] = [];
    let filesScanned = 0;

    for (const file of files) {
        try {
            const doc = await vscode.workspace.openTextDocument(file);
            filesScanned++;
            const text = doc.getText();
            const lineTexts = text.split(/\r?\n/);
            for (let lineIdx = 0; lineIdx < lineTexts.length; lineIdx++) {
                const line = lineTexts[lineIdx];
                regex.lastIndex = 0;
                let m: RegExpExecArray | null;
                while ((m = regex.exec(line)) !== null) {
                    matches.push({
                        file: file.fsPath,
                        line: lineIdx + 1,
                        column: m.index + 1,
                        text: line.trim().slice(0, 200),
                    });
                    if (m.index === regex.lastIndex) regex.lastIndex++;
                    if (matches.length > 1000) {
                        return { matches, filesScanned };
                    }
                }
            }
        } catch {
            // Skip binary or unreadable files
        }
    }

    return { matches, filesScanned };
}

export async function replaceInFiles(
    pattern: string,
    replacement: string,
    options: { regex?: boolean; caseSensitive?: boolean; wholeWord?: boolean } = {}
): Promise<{ replaced: number; files: number; error?: string }> {
    if (!pattern) return { replaced: 0, files: 0, error: t('Empty pattern') };

    let regex: RegExp;
    try {
        const flags = options.caseSensitive ? 'g' : 'gi';
        const source = options.regex ? pattern : pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const wrapped = options.wholeWord ? `\\b${source}\\b` : source;
        regex = new RegExp(wrapped, flags);
    } catch (e) {
        return { replaced: 0, files: 0, error: t('Invalid pattern') };
    }

    const files = await vscode.workspace.findFiles('**/*', '**/{node_modules,dist,.git,out,build}/**', 500);
    let replaced = 0;
    let filesCount = 0;

    for (const file of files) {
        try {
            const doc = await vscode.workspace.openTextDocument(file);
            const original = doc.getText();
            const updated = original.replace(regex, (...args) => {
                replaced++;
                return replacement.replace(/\$(\d+)/g, (_, n) => args[Number(n)] ?? '');
            });
            if (updated !== original) {
                const edit = new vscode.WorkspaceEdit();
                const firstLine = doc.lineAt(0);
                const lastLine = doc.lineAt(doc.lineCount - 1);
                const fullRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
                edit.replace(file, fullRange, updated);
                await vscode.workspace.applyEdit(edit);
                filesCount++;
            }
        } catch {
            // Skip unreadable
        }
    }

    return { replaced: replaced, files: filesCount };
}
