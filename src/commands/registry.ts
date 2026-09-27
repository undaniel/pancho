export const Categories = {
    edit: '%category.pancho.edit%',
    lines: '%category.pancho.lines%',
    textCase: '%category.pancho.textCase%',
    convert: '%category.pancho.convert%',
    escape: '%category.pancho.escape%',
    dev: '%category.pancho.dev%',
    macros: '%category.pancho.macros%',
    actions: '%command.category%',
} as const;

export type CategoryKey = keyof typeof Categories;

/**
 * Fuente unica de la lista de comandos (id + categoria + enablement).
 * `npm run commands:sync` regenera `contributes.commands` en package.json.
 */
const Manifest = {
    CLEAN_WHITESPACE: { id: 'pancho.cleanWhitespace', category: 'edit', enablement: 'editorIsOpen' },
    CLEAN_LINE_ENDINGS: { id: 'pancho.cleanLineEndings', category: 'edit', enablement: 'editorIsOpen' },
    TRIM_LINES: { id: 'pancho.trimLines', category: 'edit', enablement: 'editorIsOpen' },
    LINE_ENDINGS_TO_SPACES: { id: 'pancho.lineEndingsToSpaces', category: 'edit', enablement: 'editorIsOpen' },
    CONVERT_TABS_TO_SPACES: { id: 'pancho.convertTabsToSpaces', category: 'edit', enablement: 'editorIsOpen' },
    CONVERT_SPACES_TO_TABS: { id: 'pancho.convertSpacesToTabs', category: 'edit', enablement: 'editorIsOpen' },
    INCREASE_INDENT: { id: 'pancho.increaseIndent', category: 'edit', enablement: 'editorIsOpen' },
    DECREASE_INDENT: { id: 'pancho.decreaseIndent', category: 'edit', enablement: 'editorIsOpen' },
    TO_UPPER_CASE: { id: 'pancho.toUpperCase', category: 'textCase', enablement: 'editorIsOpen' },
    TO_LOWER_CASE: { id: 'pancho.toLowerCase', category: 'textCase', enablement: 'editorIsOpen' },
    TO_TITLE_CASE: { id: 'pancho.toTitleCase', category: 'textCase', enablement: 'editorIsOpen' },
    TO_WINDOWS_EOL: { id: 'pancho.toWindowsEOL', category: 'edit', enablement: 'editorIsOpen' },
    TO_UNIX_EOL: { id: 'pancho.toUnixEOL', category: 'edit', enablement: 'editorIsOpen' },
    TO_MAC_EOL: { id: 'pancho.toMacEOL', category: 'edit', enablement: 'editorIsOpen' },
    REMOVE_DUPLICATE_LINES: { id: 'pancho.removeDuplicateLines', category: 'lines', enablement: 'editorIsOpen' },
    SORT_ASCENDING: { id: 'pancho.sortAscending', category: 'lines', enablement: 'editorIsOpen' },
    SORT_DESCENDING: { id: 'pancho.sortDescending', category: 'lines', enablement: 'editorIsOpen' },
    REVERSE_LINES: { id: 'pancho.reverseLines', category: 'lines', enablement: 'editorIsOpen' },
    JOIN_LINES: { id: 'pancho.joinLines', category: 'lines', enablement: 'editorIsOpen' },
    REMOVE_EMPTY_LINES: { id: 'pancho.removeEmptyLines', category: 'lines', enablement: 'editorIsOpen' },
    COUNT_WORDS: { id: 'pancho.countWords', category: 'textCase', enablement: 'editorIsOpen' },
    COUNT_CHARACTERS: { id: 'pancho.countCharacters', category: 'textCase', enablement: 'editorIsOpen' },
    COUNT_LINES: { id: 'pancho.countLines', category: 'textCase', enablement: 'editorIsOpen' },
    REMOVE_DUPLICATE_WORDS: { id: 'pancho.removeDuplicateWords', category: 'textCase', enablement: 'editorIsOpen' },
    NUMBER_LINES: { id: 'pancho.numberLines', category: 'textCase', enablement: 'editorIsOpen' },
    REMOVE_LINE_NUMBERS: { id: 'pancho.removeLineNumbers', category: 'textCase', enablement: 'editorIsOpen' },
    SLUGIFY: { id: 'pancho.slugify', category: 'textCase', enablement: 'editorIsOpen' },
    REVERSE_WORDS: { id: 'pancho.reverseWords', category: 'textCase', enablement: 'editorIsOpen' },
    RANDOMIZE_LINES: { id: 'pancho.randomizeLines', category: 'lines', enablement: 'editorIsOpen' },
    PASTE_WITHOUT_LINE_BREAK: { id: 'pancho.pasteWithoutLineBreak', category: 'textCase', enablement: 'editorIsOpen' },
    COPY_TO_MULTIPLE_LINES: { id: 'pancho.copyToMultipleLines', category: 'textCase', enablement: 'editorIsOpen' },
    FORMAT_AS_CSV: { id: 'pancho.formatAsCSV', category: 'textCase', enablement: 'editorIsOpen' },
    BASE64_ENCODE: { id: 'pancho.base64Encode', category: 'convert', enablement: 'editorIsOpen' },
    BASE64_DECODE: { id: 'pancho.base64Decode', category: 'convert', enablement: 'editorIsOpen' },
    URL_ENCODE: { id: 'pancho.urlEncode', category: 'convert', enablement: 'editorIsOpen' },
    URL_DECODE: { id: 'pancho.urlDecode', category: 'convert', enablement: 'editorIsOpen' },
    HTML_ENTITIES_ENCODE: { id: 'pancho.htmlEntitiesEncode', category: 'convert', enablement: 'editorIsOpen' },
    HTML_ENTITIES_DECODE: { id: 'pancho.htmlEntitiesDecode', category: 'convert', enablement: 'editorIsOpen' },
    MINIFY_JSON: { id: 'pancho.minifyJSON', category: 'convert', enablement: 'editorIsOpen' },
    PRETTIFY_JSON: { id: 'pancho.prettifyJSON', category: 'convert', enablement: 'editorIsOpen' },
    MINIFY_HTML: { id: 'pancho.minifyHTML', category: 'convert', enablement: 'editorIsOpen' },
    PRETTIFY_HTML: { id: 'pancho.prettifyHTML', category: 'convert', enablement: 'editorIsOpen' },
    MINIFY_CSS: { id: 'pancho.minifyCSS', category: 'convert', enablement: 'editorIsOpen' },
    PRETTIFY_CSS: { id: 'pancho.prettifyCSS', category: 'convert', enablement: 'editorIsOpen' },
    MINIFY_JS: { id: 'pancho.minifyJS', category: 'convert', enablement: 'editorIsOpen' },
    PRETTIFY_JS: { id: 'pancho.prettifyJS', category: 'convert', enablement: 'editorIsOpen' },
    FORMAT_SQL: { id: 'pancho.formatSQL', category: 'convert', enablement: 'editorIsOpen' },
    PRETTIFY_XML: { id: 'pancho.prettifyXML', category: 'convert', enablement: 'editorIsOpen' },
    MINIFY_XML: { id: 'pancho.minifyXML', category: 'convert', enablement: 'editorIsOpen' },
    HASH_MD5: { id: 'pancho.hashMD5', category: 'convert', enablement: 'editorIsOpen' },
    HASH_SHA256: { id: 'pancho.hashSHA256', category: 'convert', enablement: 'editorIsOpen' },
    TO_BINARY: { id: 'pancho.toBinary', category: 'convert', enablement: 'editorIsOpen' },
    FROM_BINARY: { id: 'pancho.fromBinary', category: 'convert', enablement: 'editorIsOpen' },
    TO_HEX: { id: 'pancho.toHex', category: 'convert', enablement: 'editorIsOpen' },
    FROM_HEX: { id: 'pancho.fromHex', category: 'convert', enablement: 'editorIsOpen' },
    INSERT_SHORT_TIME: { id: 'pancho.insertShortTime', category: 'dev', enablement: 'editorIsOpen' },
    INSERT_LONG_TIME: { id: 'pancho.insertLongTime', category: 'dev', enablement: 'editorIsOpen' },
    INSERT_DATE_TIME: { id: 'pancho.insertDateTime', category: 'dev', enablement: 'editorIsOpen' },
    LOREM_IPSUM: { id: 'pancho.loremIpsum', category: 'dev', enablement: 'editorIsOpen' },
    COMMENT_LINE: { id: 'pancho.commentLine', category: 'dev', enablement: 'editorIsOpen' },
    COMMENT_BLOCK: { id: 'pancho.commentBlock', category: 'dev', enablement: 'editorIsOpen' },
    GENERATE_UUID: { id: 'pancho.generateUUID', category: 'dev', enablement: 'editorIsOpen' },
    GENERATE_RANDOM_STRING: { id: 'pancho.generateRandomString', category: 'dev', enablement: 'editorIsOpen' },
    HEX_TO_RGB: { id: 'pancho.hexToRgb', category: 'convert', enablement: 'editorIsOpen' },
    RGB_TO_HEX: { id: 'pancho.rgbToHex', category: 'convert', enablement: 'editorIsOpen' },
    DUPLICATE_LINE: { id: 'pancho.duplicateLine', category: 'dev', enablement: 'editorIsOpen' },
    INSERT_LINE_BEFORE: { id: 'pancho.insertLineBefore', category: 'dev', enablement: 'editorIsOpen' },
    INSERT_LINE_AFTER: { id: 'pancho.insertLineAfter', category: 'dev', enablement: 'editorIsOpen' },
    MOVE_LINE_UP: { id: 'pancho.moveLineUp', category: 'dev', enablement: 'editorIsOpen' },
    MOVE_LINE_DOWN: { id: 'pancho.moveLineDown', category: 'dev', enablement: 'editorIsOpen' },
    DELETE_LINES_CONTAINING: { id: 'pancho.deleteLinesContaining', category: 'dev', enablement: 'editorIsOpen' },
    KEEP_ONLY_LINES_CONTAINING: { id: 'pancho.keepOnlyLinesContaining', category: 'dev', enablement: 'editorIsOpen' },
    ESCAPE_JSON: { id: 'pancho.escapeJSON', category: 'escape', enablement: 'editorIsOpen' },
    UNESCAPE_JSON: { id: 'pancho.unescapeJSON', category: 'escape', enablement: 'editorIsOpen' },
    ESCAPE_FOR_SQL: { id: 'pancho.escapeForSQL', category: 'escape', enablement: 'editorIsOpen' },
    UNESCAPE_FOR_SQL: { id: 'pancho.unescapeForSQL', category: 'escape', enablement: 'editorIsOpen' },
    ESCAPE_FOR_REGEX: { id: 'pancho.escapeForRegex', category: 'escape', enablement: 'editorIsOpen' },
    ESCAPE_FOR_HTML: { id: 'pancho.escapeForHTML', category: 'escape', enablement: 'editorIsOpen' },
    UNESCAPE_FOR_HTML: { id: 'pancho.unescapeForHTML', category: 'escape', enablement: 'editorIsOpen' },

    // Bloque A: comandos rápidos
    TO_SENTENCE_CASE: { id: 'pancho.toSentenceCase', category: 'textCase', enablement: 'editorIsOpen' },
    INVERT_CASE: { id: 'pancho.invertCase', category: 'textCase', enablement: 'editorIsOpen' },
    RANDOM_CASE: { id: 'pancho.randomCase', category: 'textCase', enablement: 'editorIsOpen' },
    TO_KEBAB_CASE: { id: 'pancho.toKebabCase', category: 'textCase', enablement: 'editorIsOpen' },
    TO_SNAKE_CASE: { id: 'pancho.toSnakeCase', category: 'textCase', enablement: 'editorIsOpen' },
    TO_CAMEL_CASE: { id: 'pancho.toCamelCase', category: 'textCase', enablement: 'editorIsOpen' },
    TO_PASCAL_CASE: { id: 'pancho.toPascalCase', category: 'textCase', enablement: 'editorIsOpen' },
    TO_CONSTANT_CASE: { id: 'pancho.toConstantCase', category: 'textCase', enablement: 'editorIsOpen' },
    REMOVE_DIACRITICS: { id: 'pancho.removeDiacritics', category: 'textCase', enablement: 'editorIsOpen' },
    STRIP_HTML_TAGS: { id: 'pancho.stripHTMLTags', category: 'textCase', enablement: 'editorIsOpen' },
    SORT_NATURAL: { id: 'pancho.sortNatural', category: 'lines', enablement: 'editorIsOpen' },
    SORT_NATURAL_DESCENDING: { id: 'pancho.sortNaturalDescending', category: 'lines', enablement: 'editorIsOpen' },
    SORT_BY_LENGTH: { id: 'pancho.sortByLength', category: 'lines', enablement: 'editorIsOpen' },
    SORT_BY_LENGTH_DESCENDING: { id: 'pancho.sortByLengthDescending', category: 'lines', enablement: 'editorIsOpen' },
    SORT_NUMERIC: { id: 'pancho.sortNumeric', category: 'lines', enablement: 'editorIsOpen' },
    SORT_BY_COLUMN: { id: 'pancho.sortByColumn', category: 'lines', enablement: 'editorIsOpen' },
    TRANSPOSE_CHARS: { id: 'pancho.transposeCharacters', category: 'dev', enablement: 'editorIsOpen' },
    TRANSPOSE_WORDS: { id: 'pancho.transposeWords', category: 'dev', enablement: 'editorIsOpen' },
    TRANSPOSE_LINES: { id: 'pancho.transposeLines', category: 'dev', enablement: 'editorIsOpen' },
    WRAP_TEXT: { id: 'pancho.wrapText', category: 'edit', enablement: 'editorIsOpen' },
    UNWRAP_TEXT: { id: 'pancho.unwrapText', category: 'edit', enablement: 'editorIsOpen' },
    REMOVE_CONSECUTIVE_DUPLICATE_LINES: { id: 'pancho.removeConsecutiveDuplicateLines', category: 'lines', enablement: 'editorIsOpen' },

    // Bloque B: conversiones
    CSV_TO_JSON: { id: 'pancho.csvToJSON', category: 'textCase', enablement: 'editorIsOpen' },
    JSON_TO_CSV: { id: 'pancho.jsonToCSV', category: 'textCase', enablement: 'editorIsOpen' },
    CSV_TO_TSV: { id: 'pancho.csvToTSV', category: 'textCase', enablement: 'editorIsOpen' },
    TSV_TO_CSV: { id: 'pancho.tsvToCSV', category: 'textCase', enablement: 'editorIsOpen' },
    CSV_TO_MARKDOWN: { id: 'pancho.csvToMarkdown', category: 'textCase', enablement: 'editorIsOpen' },
    MARKDOWN_TABLE_TO_CSV: { id: 'pancho.markdownTableToCSV', category: 'textCase', enablement: 'editorIsOpen' },

    // Bloque C: align
    ALIGN_BY_CHAR: { id: 'pancho.alignByChar', category: 'dev', enablement: 'editorIsOpen' },
    ALIGN_EQUALS: { id: 'pancho.alignEquals', category: 'dev', enablement: 'editorIsOpen' },
    ALIGN_COLONS: { id: 'pancho.alignColons', category: 'dev', enablement: 'editorIsOpen' },

    // Bloque D: dev tools
    DECODE_JWT: { id: 'pancho.decodeJWT', category: 'dev', enablement: 'editorIsOpen' },
    TIMESTAMP_TO_ISO: { id: 'pancho.timestampToISO', category: 'dev', enablement: 'editorIsOpen' },
    ISO_TO_TIMESTAMP: { id: 'pancho.isoToTimestamp', category: 'dev', enablement: 'editorIsOpen' },
    NOW_AS_TIMESTAMP: { id: 'pancho.nowAsTimestamp', category: 'dev', enablement: 'editorIsOpen' },
    AES_ENCRYPT: { id: 'pancho.aesEncrypt', category: 'dev', enablement: 'editorIsOpen' },
    AES_DECRYPT: { id: 'pancho.aesDecrypt', category: 'dev', enablement: 'editorIsOpen' },
    COLOR_INFO: { id: 'pancho.colorInfo', category: 'dev', enablement: 'editorIsOpen' },
    REGEX_TESTER: { id: 'pancho.regexTester', category: 'dev', enablement: 'editorIsOpen' },
    REGEX_TESTER_PANEL: { id: 'pancho.regexTesterPanel', category: 'dev' },

    // Bloque F: UX
    SHOW_MENU: { id: 'pancho.showMenu', category: 'actions' },
    REPEAT_LAST: { id: 'pancho.repeatLast', category: 'actions' },
    REPEAT_LAST_TIMES: { id: 'pancho.repeatLastTimes', category: 'actions' },
    FAVORITES_SHOW: { id: 'pancho.showFavorites', category: 'actions' },
    FAVORITE_TOGGLE: { id: 'pancho.toggleFavorite', category: 'actions' },
    SMART_ACTIONS: { id: 'pancho.smartActions', category: 'actions', enablement: 'editorIsOpen' },
    RUN_PIPELINE: { id: 'pancho.runPipeline', category: 'actions', enablement: 'editorIsOpen' },
    MANAGE_PIPELINES: { id: 'pancho.managePipelines', category: 'actions' },
    FORMAT_DOCUMENT: { id: 'pancho.formatDocument', category: 'edit', enablement: 'editorIsOpen' },
    FORMAT_SELECTION: { id: 'pancho.formatSelection', category: 'edit', enablement: 'editorHasSelection' },

    // Bloque G: columnas
    COLUMN_INSERT: { id: 'pancho.columnInsert', category: 'macros', enablement: 'editorIsOpen' },
    COLUMN_DELETE: { id: 'pancho.columnDelete', category: 'macros', enablement: 'editorIsOpen' },
    COLUMN_COPY: { id: 'pancho.columnCopy', category: 'macros', enablement: 'editorIsOpen' },
    COLUMN_PASTE: { id: 'pancho.columnPaste', category: 'macros', enablement: 'editorIsOpen' },
    COLUMN_FILL_SERIES: { id: 'pancho.columnFillSeries', category: 'macros', enablement: 'editorIsOpen' },

    // Bloque H: macros
    MACRO_START: { id: 'pancho.macroStart', category: 'macros' },
    MACRO_STOP: { id: 'pancho.macroStop', category: 'macros' },
    MACRO_PLAY: { id: 'pancho.macroPlay', category: 'macros', enablement: 'editorIsOpen' },
    MACRO_SAVE: { id: 'pancho.macroSave', category: 'macros' },
    MACRO_LOAD: { id: 'pancho.macroLoad', category: 'macros' },
    MACRO_LIST: { id: 'pancho.macroList', category: 'macros' },
    MACRO_EXPORT: { id: 'pancho.macroExport', category: 'macros' },
    MACRO_IMPORT: { id: 'pancho.macroImport', category: 'macros' },

    // Bloque J: filtros
    FILTER_LINES_BY_REGEX: { id: 'pancho.filterLinesByRegex', category: 'textCase', enablement: 'editorIsOpen' },
    REMOVE_LINES_BY_REGEX: { id: 'pancho.removeLinesByRegex', category: 'textCase', enablement: 'editorIsOpen' },

    // Historial de portapapeles
    CLIPBOARD_HISTORY: { id: 'pancho.clipboardHistory', category: 'textCase', enablement: 'editorIsOpen' },

    // Estado (solo Command Palette)
    SHOW_STATUS_INFO: { id: 'pancho.showStatusInfo', category: 'actions' },

    // Soporte (solo Command Palette, pero listados en el menu para el guard de accesibilidad)
    SHOW_LOGS: { id: 'pancho.showLogs', category: 'actions' },
    REPORT_ISSUE: { id: 'pancho.reportIssue', category: 'actions' },
} as const;

export const Commands = Object.fromEntries(
    Object.entries(Manifest).map(([key, value]) => [key, value.id]),
) as { readonly [K in keyof typeof Manifest]: typeof Manifest[K]['id'] };

export type CommandName = typeof Manifest[keyof typeof Manifest]['id'];

export const commandManifest = Manifest;
