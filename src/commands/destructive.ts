import { CommandName, Commands } from './registry';

/**
 * Commands whose result can substantially rewrite the buffer. When
 * `pancho.previewDestructive` is enabled, these show a diff before applying.
 * Commands delegated to native VS Code are handled by the editor itself.
 */
export const DESTRUCTIVE_COMMANDS: ReadonlySet<CommandName> = new Set<CommandName>([
    Commands.CLEAN_WHITESPACE,
    Commands.CLEAN_LINE_ENDINGS,
    Commands.TRIM_LINES,
    Commands.LINE_ENDINGS_TO_SPACES,
    Commands.TO_WINDOWS_EOL,
    Commands.TO_UNIX_EOL,
    Commands.TO_MAC_EOL,
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
    Commands.NUMBER_LINES,
    Commands.REMOVE_LINE_NUMBERS,
    Commands.REMOVE_DIACRITICS,
    Commands.STRIP_HTML_TAGS,
    Commands.TRANSPOSE_CHARS,
    Commands.TRANSPOSE_WORDS,
    Commands.TRANSPOSE_LINES,
    Commands.WRAP_TEXT,
    Commands.UNWRAP_TEXT,
    Commands.DELETE_LINES_CONTAINING,
    Commands.KEEP_ONLY_LINES_CONTAINING,
    Commands.ALIGN_EQUALS,
    Commands.ALIGN_COLONS,
    Commands.ALIGN_BY_CHAR,
]);
