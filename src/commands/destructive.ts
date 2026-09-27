import { CommandName, Commands } from './registry';

/**
 * Commands that discard content or irreversibly reorder it, where a diff
 * before/after genuinely helps to verify the result. Plain conversions and
 * reformatting (whitespace, EOL, trim, align, wrap, numbering) are intentionally
 * left out: they are easy to read and only add friction. When
 * `pancho.previewDestructive` is enabled, only these show a diff before applying.
 * Commands delegated to native VS Code are handled by the editor itself.
 */
export const DESTRUCTIVE_COMMANDS: ReadonlySet<CommandName> = new Set<CommandName>([
    Commands.REMOVE_DUPLICATE_LINES,
    Commands.REMOVE_CONSECUTIVE_DUPLICATE_LINES,
    Commands.SORT_NATURAL,
    Commands.SORT_NATURAL_DESCENDING,
    Commands.SORT_BY_LENGTH,
    Commands.SORT_BY_LENGTH_DESCENDING,
    Commands.SORT_NUMERIC,
    Commands.REVERSE_LINES,
    Commands.RANDOMIZE_LINES,
    Commands.REMOVE_EMPTY_LINES,
    Commands.REMOVE_DUPLICATE_WORDS,
    Commands.REMOVE_LINE_NUMBERS,
    Commands.REMOVE_DIACRITICS,
    Commands.STRIP_HTML_TAGS,
    Commands.TRANSPOSE_CHARS,
    Commands.TRANSPOSE_WORDS,
    Commands.TRANSPOSE_LINES,
    Commands.DELETE_LINES_CONTAINING,
    Commands.KEEP_ONLY_LINES_CONTAINING,
]);
