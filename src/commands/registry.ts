export const Commands = {
    CLEAN_WHITESPACE: 'pancho.cleanWhitespace',
    CLEAN_LINE_ENDINGS: 'pancho.cleanLineEndings',
    CONVERT_TABS_TO_SPACES: 'pancho.convertTabsToSpaces',
    CONVERT_SPACES_TO_TABS: 'pancho.convertSpacesToTabs',
    TO_UPPER_CASE: 'pancho.toUpperCase',
    TO_LOWER_CASE: 'pancho.toLowerCase',
    TO_TITLE_CASE: 'pancho.toTitleCase',
    TRIM_LINES: 'pancho.trimLines',
    LINE_ENDINGS_TO_SPACES: 'pancho.lineEndingsToSpaces',
    INCREASE_INDENT: 'pancho.increaseIndent',
    DECREASE_INDENT: 'pancho.decreaseIndent',
    INSERT_SHORT_TIME: 'pancho.insertShortTime',
    INSERT_LONG_TIME: 'pancho.insertLongTime',
    INSERT_DATE_TIME: 'pancho.insertDateTime',
} as const;

export type CommandName = typeof Commands[keyof typeof Commands];

export interface Command {
    name: CommandName;
    title: string;
}

export const CommandList: Command[] = [
    { name: Commands.CLEAN_WHITESPACE, title: 'Limpiar espacios en blanco' },
    { name: Commands.CLEAN_LINE_ENDINGS, title: 'Limpiar saltos de línea' },
    { name: Commands.CONVERT_TABS_TO_SPACES, title: 'Convertir tabs a espacios' },
    { name: Commands.CONVERT_SPACES_TO_TABS, title: 'Convertir espacios a tabs' },
    { name: Commands.TO_UPPER_CASE, title: 'Convertir a MAYÚSCULAS' },
    { name: Commands.TO_LOWER_CASE, title: 'Convertir a minúsculas' },
    { name: Commands.TO_TITLE_CASE, title: 'Convertir a Título' },
    { name: Commands.TRIM_LINES, title: 'Recortar líneas' },
    { name: Commands.LINE_ENDINGS_TO_SPACES, title: 'Convertir saltos de línea a espacios' },
    { name: Commands.INCREASE_INDENT, title: 'Aumentar indentación' },
    { name: Commands.DECREASE_INDENT, title: 'Disminuir indentación' },
    { name: Commands.INSERT_SHORT_TIME, title: 'Fecha y hora corta' },
    { name: Commands.INSERT_LONG_TIME, title: 'Fecha y hora larga' },
    { name: Commands.INSERT_DATE_TIME, title: 'FechaHora (2026-05-16 20:56:51)' },
];