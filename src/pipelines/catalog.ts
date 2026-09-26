import { cleanWhitespace } from '../transforms/whitespace';
import { trimLines } from '../transforms/lineUtils';
import { removeDuplicateLines, removeConsecutiveDuplicateLines, removeEmptyLines, reverseLines } from '../transforms/lines';
import { removeDuplicateWords, slugify } from '../transforms/textGeneral';
import { sortNatural, sortNumeric } from '../transforms/sort';
import { toSentenceCase, toKebabCase, toSnakeCase, toCamelCase, toConstantCase } from '../transforms/case';
import { base64Encode, base64Decode, urlEncode, urlDecode, minify as minifyJSON, prettify as prettifyJSON } from '../transforms/webDev';
import { escapeJSON } from '../transforms/escape';
import { csvToJSON, jsonToCSV } from '../transforms/convert';

export type PipelineTransform = (text: string) => string | { result: string; error?: string };

export interface PipelineStep {
    command: string;
    /** English label; render with `t(step.label)` so it is localized. */
    label: string;
    transform: PipelineTransform;
}

/**
 * Curated, argument-less transforms that can be chained into a pipeline.
 * Every entry reuses the very same function the equivalent command runs.
 */
export const PIPELINE_STEPS: readonly PipelineStep[] = [
    { command: 'pancho.cleanWhitespace', label: 'Clean whitespace', transform: text => cleanWhitespace(text) },
    { command: 'pancho.trimLines', label: 'Trim lines', transform: text => trimLines(text) },
    { command: 'pancho.removeEmptyLines', label: 'Remove empty lines', transform: text => removeEmptyLines(text) },
    { command: 'pancho.removeDuplicateLines', label: 'Remove duplicate lines', transform: text => removeDuplicateLines(text) },
    { command: 'pancho.removeConsecutiveDuplicateLines', label: 'Remove consecutive duplicate lines', transform: text => removeConsecutiveDuplicateLines(text) },
    { command: 'pancho.removeDuplicateWords', label: 'Remove duplicate words', transform: text => removeDuplicateWords(text) },
    { command: 'pancho.sortNatural', label: 'Sort natural', transform: text => sortNatural(text) },
    { command: 'pancho.sortNumeric', label: 'Sort numeric', transform: text => sortNumeric(text) },
    { command: 'pancho.reverseLines', label: 'Reverse lines', transform: text => reverseLines(text) },
    { command: 'pancho.toSentenceCase', label: 'Convert to sentence case', transform: text => toSentenceCase(text) },
    { command: 'pancho.toKebabCase', label: 'Convert to kebab-case', transform: text => toKebabCase(text) },
    { command: 'pancho.toSnakeCase', label: 'Convert to snake_case', transform: text => toSnakeCase(text) },
    { command: 'pancho.toCamelCase', label: 'Convert to camelCase', transform: text => toCamelCase(text) },
    { command: 'pancho.toConstantCase', label: 'Convert to CONSTANT_CASE', transform: text => toConstantCase(text) },
    { command: 'pancho.slugify', label: 'Generate URL slug', transform: text => slugify(text) },
    { command: 'pancho.base64Encode', label: 'Base64 encode', transform: text => base64Encode(text) },
    { command: 'pancho.base64Decode', label: 'Base64 decode', transform: text => base64Decode(text) },
    { command: 'pancho.urlEncode', label: 'URL encode', transform: text => urlEncode(text) },
    { command: 'pancho.urlDecode', label: 'URL decode', transform: text => urlDecode(text) },
    { command: 'pancho.escapeJSON', label: 'Escape for JSON', transform: text => escapeJSON(text) },
    { command: 'pancho.csvToJSON', label: 'CSV to JSON', transform: text => csvToJSON(text) },
    { command: 'pancho.jsonToCSV', label: 'JSON to CSV', transform: text => jsonToCSV(text) },
    { command: 'pancho.minifyJSON', label: 'Minify JSON', transform: text => minifyJSON(text) },
    { command: 'pancho.prettifyJSON', label: 'Prettify JSON', transform: text => prettifyJSON(text) },
];

export function pipelineStep(command: string): PipelineStep | undefined {
    return PIPELINE_STEPS.find(step => step.command === command);
}

export interface PipelineRunResult {
    result: string;
    /** Command id of the step that failed, if any. */
    failedAt?: string;
    error?: string;
}

/** Applies the steps in order; stops and reports on the first error. */
export function runPipelineSteps(text: string, steps: readonly PipelineStep[]): PipelineRunResult {
    let current = text;
    for (const step of steps) {
        const output = step.transform(current);
        if (typeof output === 'string') {
            current = output;
            continue;
        }
        if (output.error) {
            return { result: current, failedAt: step.command, error: output.error };
        }
        current = output.result;
    }
    return { result: current };
}
