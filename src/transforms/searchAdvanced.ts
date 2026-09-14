import * as vscode from 'vscode';
import { t } from '../utils/i18n';
import { getDocumentRange } from '../utils/editor';
import { runRegexJob } from '../utils/safeRegex';
import type { RegexErrorCode } from '../utils/regexCore';
import { computeLineStarts, lineIndexAtOffset, lineTextAt } from '../core/textOffsets';

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
    cancelled?: boolean;
}

export interface SearchOptions {
    regex?: boolean;
    caseSensitive?: boolean;
    wholeWord?: boolean;
}

const MAX_FILES = 500;
const MAX_MATCHES = 1000;

function describeError(code: RegexErrorCode | undefined): string {
    switch (code) {
        case 'empty':
            return t('Empty pattern');
        case 'complex':
        case 'timeout':
            return t('Pattern too complex (possible catastrophic backtracking)');
        default:
            return t('Invalid pattern');
    }
}

function buildPattern(pattern: string, options: SearchOptions): { source: string; flags: string } | { error: string } {
    const flags = options.caseSensitive ? 'g' : 'gi';
    const source = options.regex ? pattern : pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const wrapped = options.wholeWord ? `\\b${source}\\b` : source;
    try {
        new RegExp(wrapped, flags);
    } catch {
        return { error: t('Invalid pattern') };
    }
    return { source: wrapped, flags };
}

export async function findInFiles(pattern: string, options: SearchOptions = {}, timeoutMs?: number, token?: vscode.CancellationToken): Promise<SearchResult> {
    if (!pattern) return { matches: [], error: t('Empty pattern') };

    const built = buildPattern(pattern, options);
    if ('error' in built) return { matches: [], error: built.error };

    const files = await vscode.workspace.findFiles('**/*', '**/{node_modules,dist,.git,out,build}/**', MAX_FILES);
    const matches: SearchMatch[] = [];
    let filesScanned = 0;

    for (const file of files) {
        if (token?.isCancellationRequested) return { matches, filesScanned, cancelled: true };
        try {
            const doc = await vscode.workspace.openTextDocument(file);
            filesScanned++;
            const text = doc.getText();
            const result = await runRegexJob(
                { pattern: built.source, flags: built.flags, text, mode: 'exec', maxMatches: MAX_MATCHES },
                timeoutMs
            );
            if (result.error) return { matches, error: describeError(result.error), filesScanned };

            const lineStarts = computeLineStarts(text);
            for (const m of result.matches ?? []) {
                const line = lineIndexAtOffset(lineStarts, m.index);
                matches.push({
                    file: file.fsPath,
                    line: line + 1,
                    column: m.index - lineStarts[line] + 1,
                    text: lineTextAt(text, lineStarts, line).trim().slice(0, 200),
                });
                if (matches.length > MAX_MATCHES) return { matches, filesScanned };
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
    options: SearchOptions = {},
    timeoutMs?: number,
    token?: vscode.CancellationToken
): Promise<{ replaced: number; files: number; error?: string; cancelled?: boolean }> {
    if (!pattern) return { replaced: 0, files: 0, error: t('Empty pattern') };
    if (!vscode.workspace.isTrusted) {
        return { replaced: 0, files: 0, error: t('Workspace is not trusted. Replace in files is disabled.') };
    }

    const built = buildPattern(pattern, options);
    if ('error' in built) return { replaced: 0, files: 0, error: built.error };

    const effectiveReplacement = options.regex ? replacement : replacement.replace(/\$/g, '$$$$');

    const files = await vscode.workspace.findFiles('**/*', '**/{node_modules,dist,.git,out,build}/**', MAX_FILES);
    let replaced = 0;
    let filesCount = 0;

    for (const file of files) {
        if (token?.isCancellationRequested) return { replaced, files: filesCount, cancelled: true };
        try {
            const doc = await vscode.workspace.openTextDocument(file);
            const original = doc.getText();
            const result = await runRegexJob(
                { pattern: built.source, flags: built.flags, text: original, mode: 'replace', replacement: effectiveReplacement },
                timeoutMs
            );
            if (result.error) return { replaced, files: filesCount, error: describeError(result.error) };
            if ((result.count ?? 0) > 0 && result.result !== original) {
                const edit = new vscode.WorkspaceEdit();
                edit.replace(file, getDocumentRange(doc), result.result ?? original);
                await vscode.workspace.applyEdit(edit);
                replaced += result.count ?? 0;
                filesCount++;
            }
        } catch {
            // Skip unreadable
        }
    }

    return { replaced, files: filesCount };
}
