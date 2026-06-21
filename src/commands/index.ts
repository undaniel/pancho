import * as vscode from 'vscode';
import { Commands } from './registry';
import { registerTextCommand, registerInsertCommand, registerInfoCommand, registerLineCommand, registerPromptCommand, registerAsyncCommand } from './factory';
import { getSelection, getDocumentText } from '../utils/editor';
import { cleanWhitespace } from '../transforms/whitespace';
import { cleanLineEndings, lineEndingsToSpaces } from '../transforms/lineEndings';
import { toUpper, toLower, toTitleCase, toSentenceCase, invertCase, randomCase, toKebabCase, toSnakeCase, toCamelCase, toPascalCase, toConstantCase } from '../transforms/case';
import { tabsToSpaces, spacesToTabs, increaseIndent, decreaseIndent } from '../transforms/tabs';
import { trimLines } from '../transforms/lineUtils';
import { formatShortDateTime, formatLongDateTime, formatCustomDateTime } from '../transforms/dateTime';
import { commentLine, uncommentLine, commentBlock, uncommentBlock } from '../transforms/comments';
import { removeDuplicateLines, removeConsecutiveDuplicateLines, sortLinesAscending, sortLinesDescending, reverseLines, joinLines, removeEmptyLines, moveLineUp, moveLineDown } from '../transforms/lines';
import { sortNatural, sortNaturalDescending, sortByLength, sortByLengthDescending, sortNumeric } from '../transforms/sort';
import { removeDiacritics, stripHTMLTags, wrapText, unwrapText } from '../transforms/text';
import { transposeCharacters, transposeWords, transposeLines } from '../transforms/transpose';
import { toWindowsEOL, toUnixEOL, toMacEOL } from '../transforms/eol';
import { pasteWithoutLineBreak, copyToMultipleLines, formatAsCSV } from '../transforms/specialPaste';
import { countWords, countCharacters, countLines, removeDuplicateWords, numberLines, removeLineNumbers, slugify, reverseWords, randomizeLines } from '../transforms/textGeneral';
import { minify as minifyJSON, prettify as prettifyJSON, minifyHTML, prettifyHTML, minifyCSS, prettifyCSS, minifyJS, prettifyJS, htmlEntitiesEncode, htmlEntitiesDecode, base64Encode, base64Decode, urlEncode, urlDecode, hexToRgb, rgbToHex, generateLoremIpsum } from '../transforms/webDev';
import { formatSQL, minifyXML, prettifyXML, generateUUID, generateRandomString, hashMD5, hashSHA256, toBinary, fromBinary, toHex, fromHex } from '../transforms/programmer';
import { duplicateLine, insertLineBefore, insertLineAfter, deleteLinesContaining, keepOnlyLinesContaining } from '../transforms/lineEdit';
import { highlightMatches, countMatches } from '../transforms/search';
import { escapeJSON, unescapeJSON, escapeForSQL, unescapeForSQL, escapeForRegex, escapeForHTML, unescapeForHTML } from '../transforms/escape';
import { csvToJSON, jsonToCSV, csvToTSV, tsvToCSV, csvToMarkdown, markdownTableToCSV } from '../transforms/convert';
import { alignByChar, alignEquals, alignColons } from '../transforms/align';
import { decodeJWT } from '../transforms/jwt';
import { timestampToISO, isoToTimestamp, nowAsTimestamp } from '../transforms/timestamp';
import { aesEncrypt, aesDecrypt } from '../transforms/aes';
import { colorInfo } from '../transforms/colorInfo';
import { formatRegexResult } from '../transforms/regex';
import { findInFiles, replaceInFiles } from '../transforms/searchAdvanced';

export function registerAllCommands(context: vscode.ExtensionContext): void {
    registerTextCommand(context, { command: Commands.CLEAN_WHITESPACE, transform: (text) => cleanWhitespace(text) });
    registerTextCommand(context, { command: Commands.CLEAN_LINE_ENDINGS, transform: (text) => cleanLineEndings(text) });
    registerTextCommand(context, { command: Commands.TRIM_LINES, transform: (text) => trimLines(text) });
    registerTextCommand(context, { command: Commands.LINE_ENDINGS_TO_SPACES, transform: (text) => lineEndingsToSpaces(text) });
    registerTextCommand(context, { command: Commands.CONVERT_TABS_TO_SPACES, transform: (text, tabSize) => tabsToSpaces(text, tabSize) });
    registerTextCommand(context, { command: Commands.CONVERT_SPACES_TO_TABS, transform: (text, tabSize) => spacesToTabs(text, tabSize) });
    registerTextCommand(context, { command: Commands.INCREASE_INDENT, transform: (text, tabSize) => increaseIndent(text, tabSize) });
    registerTextCommand(context, { command: Commands.DECREASE_INDENT, transform: (text, tabSize) => decreaseIndent(text, tabSize) });
    registerTextCommand(context, { command: Commands.TO_UPPER_CASE, transform: (text) => toUpper(text) });
    registerTextCommand(context, { command: Commands.TO_LOWER_CASE, transform: (text) => toLower(text) });
    registerTextCommand(context, { command: Commands.TO_TITLE_CASE, transform: (text) => toTitleCase(text) });
    registerTextCommand(context, { command: Commands.TO_WINDOWS_EOL, transform: (text) => toWindowsEOL(text) });
    registerTextCommand(context, { command: Commands.TO_UNIX_EOL, transform: (text) => toUnixEOL(text) });
    registerTextCommand(context, { command: Commands.TO_MAC_EOL, transform: (text) => toMacEOL(text) });
    registerTextCommand(context, { command: Commands.REMOVE_DUPLICATE_LINES, transform: (text) => removeDuplicateLines(text) });
    registerTextCommand(context, { command: Commands.SORT_ASCENDING, transform: (text) => sortLinesAscending(text) });
    registerTextCommand(context, { command: Commands.SORT_DESCENDING, transform: (text) => sortLinesDescending(text) });
    registerTextCommand(context, { command: Commands.REVERSE_LINES, transform: (text) => reverseLines(text) });
    registerTextCommand(context, { command: Commands.JOIN_LINES, transform: (text) => joinLines(text) });
    registerTextCommand(context, { command: Commands.REMOVE_EMPTY_LINES, transform: (text) => removeEmptyLines(text) });
    registerTextCommand(context, { command: Commands.REMOVE_DUPLICATE_WORDS, transform: (text) => removeDuplicateWords(text) });
    registerTextCommand(context, { command: Commands.NUMBER_LINES, transform: (text) => numberLines(text) });
    registerTextCommand(context, { command: Commands.REMOVE_LINE_NUMBERS, transform: (text) => removeLineNumbers(text) });
    registerTextCommand(context, { command: Commands.SLUGIFY, transform: (text) => slugify(text) });
    registerTextCommand(context, { command: Commands.REVERSE_WORDS, transform: (text) => reverseWords(text) });
    registerTextCommand(context, { command: Commands.RANDOMIZE_LINES, transform: (text) => randomizeLines(text) });
    registerTextCommand(context, { command: Commands.PASTE_WITHOUT_LINE_BREAK, transform: (text) => pasteWithoutLineBreak(text) });
    registerTextCommand(context, { command: Commands.COPY_TO_MULTIPLE_LINES, transform: (text) => copyToMultipleLines(text, 10) });
    registerTextCommand(context, { command: Commands.FORMAT_AS_CSV, transform: (text) => formatAsCSV(text) });
    registerTextCommand(context, { command: Commands.BASE64_ENCODE, transform: (text) => base64Encode(text) });
    registerTextCommand(context, { command: Commands.BASE64_DECODE, transform: (text) => base64Decode(text) });
    registerTextCommand(context, { command: Commands.URL_ENCODE, transform: (text) => urlEncode(text) });
    registerTextCommand(context, { command: Commands.URL_DECODE, transform: (text) => urlDecode(text) });
    registerTextCommand(context, { command: Commands.HTML_ENTITIES_ENCODE, transform: (text) => htmlEntitiesEncode(text) });
    registerTextCommand(context, { command: Commands.HTML_ENTITIES_DECODE, transform: (text) => htmlEntitiesDecode(text) });
    registerTextCommand(context, { command: Commands.MINIFY_JSON, transform: (text) => minifyJSON(text) });
    registerTextCommand(context, { command: Commands.PRETTIFY_JSON, transform: (text) => prettifyJSON(text) });
    registerTextCommand(context, { command: Commands.MINIFY_HTML, transform: (text) => minifyHTML(text) });
    registerTextCommand(context, { command: Commands.PRETTIFY_HTML, transform: (text) => prettifyHTML(text) });
    registerTextCommand(context, { command: Commands.MINIFY_CSS, transform: (text) => minifyCSS(text) });
    registerTextCommand(context, { command: Commands.PRETTIFY_CSS, transform: (text) => prettifyCSS(text) });
    registerTextCommand(context, { command: Commands.MINIFY_JS, transform: (text) => minifyJS(text) });
    registerTextCommand(context, { command: Commands.PRETTIFY_JS, transform: (text) => prettifyJS(text) });
    registerTextCommand(context, { command: Commands.FORMAT_SQL, transform: (text) => formatSQL(text) });
    registerTextCommand(context, { command: Commands.PRETTIFY_XML, transform: (text) => prettifyXML(text) });
    registerTextCommand(context, { command: Commands.MINIFY_XML, transform: (text) => minifyXML(text) });
    registerTextCommand(context, { command: Commands.HASH_MD5, transform: (text) => hashMD5(text) });
    registerTextCommand(context, { command: Commands.HASH_SHA256, transform: (text) => hashSHA256(text) });
    registerTextCommand(context, { command: Commands.TO_BINARY, transform: (text) => toBinary(text) });
    registerTextCommand(context, { command: Commands.FROM_BINARY, transform: (text) => fromBinary(text) });
    registerTextCommand(context, { command: Commands.TO_HEX, transform: (text) => toHex(text) });
    registerTextCommand(context, { command: Commands.FROM_HEX, transform: (text) => fromHex(text) });
    registerTextCommand(context, { command: Commands.HEX_TO_RGB, transform: (text) => hexToRgb(text) });
    registerTextCommand(context, { command: Commands.RGB_TO_HEX, transform: (text) => rgbToHex(text) });

    registerInfoCommand(context, { command: Commands.COUNT_WORDS, info: () => 'Palabras: ' + countWords(getSelection() || getDocumentText()) });
    registerInfoCommand(context, { command: Commands.COUNT_CHARACTERS, info: () => 'Caracteres: ' + countCharacters(getSelection() || getDocumentText()) });
    registerInfoCommand(context, { command: Commands.COUNT_LINES, info: () => 'Líneas: ' + countLines(getSelection() || getDocumentText()) });

    registerInsertCommand(context, { command: Commands.INSERT_SHORT_TIME, insert: formatShortDateTime });
    registerInsertCommand(context, { command: Commands.INSERT_LONG_TIME, insert: formatLongDateTime });
    registerInsertCommand(context, { command: Commands.INSERT_DATE_TIME, insert: formatCustomDateTime });
    registerInsertCommand(context, { command: Commands.LOREM_IPSUM, insert: () => generateLoremIpsum(vscode.workspace.getConfiguration('pancho').get<number>('loremIpsumWordCount', 50)) });
    registerInsertCommand(context, { command: Commands.GENERATE_UUID, insert: () => generateUUID() });
    registerInsertCommand(context, { command: Commands.GENERATE_RANDOM_STRING, insert: () => generateRandomString(vscode.workspace.getConfiguration('pancho').get<number>('randomStringLength', 16)) });

    registerTextCommand(context, { command: Commands.COMMENT_LINE, transform: (text) => commentLine(text) });
    registerTextCommand(context, { command: Commands.UNCOMMENT_LINE, transform: (text) => uncommentLine(text) });
    registerTextCommand(context, { command: Commands.COMMENT_BLOCK, transform: (text) => commentBlock(text) });
    registerTextCommand(context, { command: Commands.UNCOMMENT_BLOCK, transform: (text) => uncommentBlock(text) });

    registerTextCommand(context, { command: Commands.DUPLICATE_LINE, transform: (text) => duplicateLine(text) });
    registerTextCommand(context, { command: Commands.INSERT_LINE_BEFORE, transform: (text) => insertLineBefore(text) });
    registerTextCommand(context, { command: Commands.INSERT_LINE_AFTER, transform: (text) => insertLineAfter(text) });
    registerLineCommand(context, { command: Commands.MOVE_LINE_UP, transform: (text, lineIndex) => moveLineUp(text, lineIndex) });
    registerLineCommand(context, { command: Commands.MOVE_LINE_DOWN, transform: (text, lineIndex) => moveLineDown(text, lineIndex) });
    registerTextCommand(context, { command: Commands.DELETE_LINES_CONTAINING, transform: (text) => deleteLinesContaining(text, vscode.window.activeTextEditor?.document.getText(vscode.window.activeTextEditor.selection) || '') });
    registerTextCommand(context, { command: Commands.KEEP_ONLY_LINES_CONTAINING, transform: (text) => keepOnlyLinesContaining(text, vscode.window.activeTextEditor?.document.getText(vscode.window.activeTextEditor.selection) || '') });
    registerTextCommand(context, { command: Commands.HIGHLIGHT_MATCHES, transform: (text) => highlightMatches(text, vscode.window.activeTextEditor?.document.getText(vscode.window.activeTextEditor.selection) || '') });
    registerInfoCommand(context, { command: Commands.COUNT_MATCHES, info: () => {
        const editor = vscode.window.activeTextEditor;
        const text = editor?.document.getText() || '';
        const pattern = editor ? editor.document.getText(editor.selection) : '';
        const result = countMatches(text, pattern);
        return 'Coincidencias: ' + result.result;
    } });

    registerTextCommand(context, { command: Commands.ESCAPE_JSON, transform: (text) => escapeJSON(text) });
    registerTextCommand(context, { command: Commands.UNESCAPE_JSON, transform: (text) => unescapeJSON(text) });
    registerTextCommand(context, { command: Commands.ESCAPE_FOR_SQL, transform: (text) => escapeForSQL(text) });
    registerTextCommand(context, { command: Commands.UNESCAPE_FOR_SQL, transform: (text) => unescapeForSQL(text) });
    registerTextCommand(context, { command: Commands.ESCAPE_FOR_REGEX, transform: (text) => escapeForRegex(text) });
    registerTextCommand(context, { command: Commands.ESCAPE_FOR_HTML, transform: (text) => escapeForHTML(text) });
    registerTextCommand(context, { command: Commands.UNESCAPE_FOR_HTML, transform: (text) => unescapeForHTML(text) });

    // ===== Bloque A: comandos rápidos =====
    registerTextCommand(context, { command: Commands.TO_SENTENCE_CASE, transform: (text) => toSentenceCase(text) });
    registerTextCommand(context, { command: Commands.INVERT_CASE, transform: (text) => invertCase(text) });
    registerTextCommand(context, { command: Commands.RANDOM_CASE, transform: (text) => randomCase(text) });
    registerTextCommand(context, { command: Commands.TO_KEBAB_CASE, transform: (text) => toKebabCase(text) });
    registerTextCommand(context, { command: Commands.TO_SNAKE_CASE, transform: (text) => toSnakeCase(text) });
    registerTextCommand(context, { command: Commands.TO_CAMEL_CASE, transform: (text) => toCamelCase(text) });
    registerTextCommand(context, { command: Commands.TO_PASCAL_CASE, transform: (text) => toPascalCase(text) });
    registerTextCommand(context, { command: Commands.TO_CONSTANT_CASE, transform: (text) => toConstantCase(text) });
    registerTextCommand(context, { command: Commands.REMOVE_DIACRITICS, transform: (text) => removeDiacritics(text) });
    registerTextCommand(context, { command: Commands.STRIP_HTML_TAGS, transform: (text) => stripHTMLTags(text) });
    registerTextCommand(context, { command: Commands.SORT_NATURAL, transform: (text) => sortNatural(text) });
    registerTextCommand(context, { command: Commands.SORT_NATURAL_DESCENDING, transform: (text) => sortNaturalDescending(text) });
    registerTextCommand(context, { command: Commands.SORT_BY_LENGTH, transform: (text) => sortByLength(text) });
    registerTextCommand(context, { command: Commands.SORT_BY_LENGTH_DESCENDING, transform: (text) => sortByLengthDescending(text) });
    registerTextCommand(context, { command: Commands.SORT_NUMERIC, transform: (text) => sortNumeric(text) });
    registerTextCommand(context, { command: Commands.TRANSPOSE_CHARS, transform: (text) => transposeCharacters(text) });
    registerTextCommand(context, { command: Commands.TRANSPOSE_WORDS, transform: (text) => transposeWords(text) });
    registerTextCommand(context, { command: Commands.TRANSPOSE_LINES, transform: (text) => transposeLines(text) });
    registerPromptCommand(context, {
        command: Commands.WRAP_TEXT,
        prompts: [{ label: vscode.l10n.t('Column width'), placeholder: '80' }],
        transform: (text, width) => wrapText(text, parseInt(width || '80', 10) || 80),
    });
    registerTextCommand(context, { command: Commands.UNWRAP_TEXT, transform: (text) => unwrapText(text) });
    registerTextCommand(context, { command: Commands.REMOVE_CONSECUTIVE_DUPLICATE_LINES, transform: (text) => removeConsecutiveDuplicateLines(text) });

    // ===== Bloque B: conversiones =====
    registerTextCommand(context, { command: Commands.CSV_TO_JSON, transform: (text) => csvToJSON(text) });
    registerTextCommand(context, { command: Commands.JSON_TO_CSV, transform: (text) => jsonToCSV(text) });
    registerTextCommand(context, { command: Commands.CSV_TO_TSV, transform: (text) => csvToTSV(text) });
    registerTextCommand(context, { command: Commands.TSV_TO_CSV, transform: (text) => tsvToCSV(text) });
    registerTextCommand(context, { command: Commands.CSV_TO_MARKDOWN, transform: (text) => csvToMarkdown(text) });
    registerTextCommand(context, { command: Commands.MARKDOWN_TABLE_TO_CSV, transform: (text) => markdownTableToCSV(text) });

    // ===== Bloque C: align =====
    registerPromptCommand(context, {
        command: Commands.ALIGN_BY_CHAR,
        prompts: [{ label: vscode.l10n.t('Character to align by'), placeholder: '=' }],
        transform: (text, char) => alignByChar(text, char || '='),
    });
    registerTextCommand(context, { command: Commands.ALIGN_EQUALS, transform: (text) => alignEquals(text) });
    registerTextCommand(context, { command: Commands.ALIGN_COLONS, transform: (text) => alignColons(text) });

    // ===== Bloque D: dev tools =====
    registerTextCommand(context, { command: Commands.DECODE_JWT, transform: (text) => decodeJWT(text) });
    registerTextCommand(context, { command: Commands.TIMESTAMP_TO_ISO, transform: (text) => timestampToISO(text) });
    registerTextCommand(context, { command: Commands.ISO_TO_TIMESTAMP, transform: (text) => isoToTimestamp(text) });
    registerInsertCommand(context, { command: Commands.NOW_AS_TIMESTAMP, insert: () => nowAsTimestamp() });
    registerPromptCommand(context, {
        command: Commands.AES_ENCRYPT,
        prompts: [{ label: vscode.l10n.t('Password'), placeholder: '********', password: true }],
        transform: (text, password) => aesEncrypt(text, password),
    });
    registerPromptCommand(context, {
        command: Commands.AES_DECRYPT,
        prompts: [{ label: vscode.l10n.t('Password'), placeholder: '********', password: true }],
        transform: (text, password) => aesDecrypt(text, password),
    });
    registerTextCommand(context, { command: Commands.COLOR_INFO, transform: (text) => colorInfo(text) });
    registerPromptCommand(context, {
        command: Commands.REGEX_TESTER,
        prompts: [
            { label: vscode.l10n.t('Regex pattern'), placeholder: '\\d+' },
            { label: vscode.l10n.t('Flags'), placeholder: 'gi' },
        ],
        transform: (text, pattern, flags) => formatRegexResult(pattern, flags || 'g', text),
    });

    // ===== Bloque E: búsqueda avanzada =====
    registerAsyncCommand(context, {
        command: Commands.FIND_IN_FILES,
        handler: async () => {
            const pattern = await vscode.window.showInputBox({
                prompt: vscode.l10n.t('Search pattern'),
                placeHolder: vscode.l10n.t('Text or regex'),
            });
            if (!pattern) return;

            const useRegex = await vscode.window.showQuickPick(
                [vscode.l10n.t('Literal'), vscode.l10n.t('Regex')],
                { placeHolder: vscode.l10n.t('Search mode') }
            );
            if (!useRegex) return;

            const caseOption = await vscode.window.showQuickPick(
                [vscode.l10n.t('Case insensitive'), vscode.l10n.t('Case sensitive')],
                { placeHolder: vscode.l10n.t('Case match') }
            );
            if (!caseOption) return;

            await vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Notification,
                    title: vscode.l10n.t('Pancho: searching in files...'),
                    cancellable: false,
                },
                async () => {
                    const result = await findInFiles(pattern, {
                        regex: useRegex === vscode.l10n.t('Regex'),
                        caseSensitive: caseOption === vscode.l10n.t('Case sensitive'),
                    });
                    if (result.error) {
                        vscode.window.showWarningMessage(vscode.l10n.t('Pancho: {0}', result.error));
                        return;
                    }
                    const channel = vscode.window.createOutputChannel('Pancho Search');
                    channel.clear();
                    channel.appendLine(vscode.l10n.t('Search: {0} ({1} matches in {2} files scanned)', pattern, result.matches.length, result.filesScanned ?? 0));
                    channel.appendLine('');
                    for (const m of result.matches) {
                        channel.appendLine(`${m.file}:${m.line}:${m.column}: ${m.text}`);
                    }
                    channel.show();
                }
            );
        },
    });

    registerAsyncCommand(context, {
        command: Commands.REPLACE_IN_FILES,
        handler: async () => {
            const pattern = await vscode.window.showInputBox({
                prompt: vscode.l10n.t('Search pattern'),
                placeHolder: vscode.l10n.t('Text or regex'),
            });
            if (pattern === undefined) return;

            const replacement = await vscode.window.showInputBox({
                prompt: vscode.l10n.t('Replacement (use $1, $2 for groups)'),
                placeHolder: '$1',
            });
            if (replacement === undefined) return;

            const useRegex = await vscode.window.showQuickPick(
                [vscode.l10n.t('Literal'), vscode.l10n.t('Regex')],
                { placeHolder: vscode.l10n.t('Search mode') }
            );
            if (!useRegex) return;

            const confirm = await vscode.window.showWarningMessage(
                vscode.l10n.t('Replace in all workspace files?'),
                { modal: true },
                vscode.l10n.t('Replace')
            );
            if (confirm !== vscode.l10n.t('Replace')) return;

            await vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Notification,
                    title: vscode.l10n.t('Pancho: replacing in files...'),
                    cancellable: false,
                },
                async () => {
                    const result = await replaceInFiles(pattern, replacement, {
                        regex: useRegex === vscode.l10n.t('Regex'),
                    });
                    if (result.error) {
                        vscode.window.showWarningMessage(vscode.l10n.t('Pancho: {0}', result.error));
                        return;
                    }
                    vscode.window.showInformationMessage(
                        vscode.l10n.t('Replaced {0} occurrences in {1} files', result.replaced, result.files)
                    );
                }
            );
        },
    });
}