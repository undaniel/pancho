import * as vscode from 'vscode';
import { Commands } from './registry';
import {
    registerTextCommand,
    registerInsertCommand,
    registerInfoCommand,
    registerPromptCommand,
    registerDocumentCommand,
    registerDelegateCommand,
} from './factory';
import { getSelection, getDocumentText } from '../utils/editor';
import { getRegexTimeoutMs } from '../utils/config';
import { cleanWhitespace } from '../transforms/whitespace';
import { cleanLineEndings, lineEndingsToSpaces } from '../transforms/lineEndings';
import { toSentenceCase, invertCase, randomCase, toKebabCase, toSnakeCase, toCamelCase, toPascalCase, toConstantCase } from '../transforms/case';
import { trimLines } from '../transforms/lineUtils';
import { formatShortDateTime, formatLongDateTime, formatCustomDateTime } from '../transforms/dateTime';
import { removeDuplicateLines, removeConsecutiveDuplicateLines, reverseLines, removeEmptyLines } from '../transforms/lines';
import { sortNatural, sortNaturalDescending, sortByLength, sortByLengthDescending, sortNumeric } from '../transforms/sort';
import { removeDiacritics, stripHTMLTags, wrapText, unwrapText } from '../transforms/text';
import { transposeCharacters, transposeWords, transposeLines } from '../transforms/transpose';
import { toWindowsEOL, toUnixEOL, toMacEOL } from '../transforms/eol';
import { pasteWithoutLineBreak, copyToMultipleLines, formatAsCSV } from '../transforms/specialPaste';
import { countWords, countCharacters, countLines, removeDuplicateWords, numberLines, removeLineNumbers, slugify, reverseWords, randomizeLines } from '../transforms/textGeneral';
import { minify as minifyJSON, prettify as prettifyJSON, minifyHTML, prettifyHTML, minifyCSS, prettifyCSS, minifyJS, prettifyJS, htmlEntitiesEncode, htmlEntitiesDecode, base64Encode, base64Decode, urlEncode, urlDecode, hexToRgb, rgbToHex, generateLoremIpsum } from '../transforms/webDev';
import { formatSQL, minifyXML, prettifyXML, generateUUID, generateRandomString, hashMD5, hashSHA256, toBinary, fromBinary, toHex, fromHex } from '../transforms/programmer';
import { deleteLinesContaining, keepOnlyLinesContaining } from '../transforms/lineEdit';
import { escapeJSON, unescapeJSON, escapeForSQL, unescapeForSQL, escapeForRegex, escapeForHTML, unescapeForHTML } from '../transforms/escape';
import { csvToJSON, jsonToCSV, csvToTSV, tsvToCSV, csvToMarkdown, markdownTableToCSV } from '../transforms/convert';
import { alignByChar, alignEquals, alignColons } from '../transforms/align';
import { decodeJWT } from '../transforms/jwt';
import { timestampToISO, isoToTimestamp, nowAsTimestamp } from '../transforms/timestamp';
import { aesEncrypt, aesDecrypt } from '../transforms/aes';
import { colorInfo } from '../transforms/colorInfo';
import { formatRegexResult } from '../transforms/regex';

export function registerAllCommands(context: vscode.ExtensionContext): void {
    // ===== Delegated to native VS Code commands (menu/shortcut kept) =====
    registerDelegateCommand(context, { command: Commands.TO_UPPER_CASE, target: 'editor.action.transformToUppercase' });
    registerDelegateCommand(context, { command: Commands.TO_LOWER_CASE, target: 'editor.action.transformToLowercase' });
    registerDelegateCommand(context, { command: Commands.TO_TITLE_CASE, target: 'editor.action.transformToTitlecase' });
    registerDelegateCommand(context, { command: Commands.COMMENT_LINE, target: 'editor.action.commentLine' });
    registerDelegateCommand(context, { command: Commands.COMMENT_BLOCK, target: 'editor.action.blockComment' });
    registerDelegateCommand(context, { command: Commands.CONVERT_TABS_TO_SPACES, target: 'editor.action.indentationToSpaces' });
    registerDelegateCommand(context, { command: Commands.CONVERT_SPACES_TO_TABS, target: 'editor.action.indentationToTabs' });
    registerDelegateCommand(context, { command: Commands.INCREASE_INDENT, target: 'editor.action.indentLines' });
    registerDelegateCommand(context, { command: Commands.DECREASE_INDENT, target: 'editor.action.outdentLines' });
    registerDelegateCommand(context, { command: Commands.MOVE_LINE_UP, target: 'editor.action.moveLinesUpAction' });
    registerDelegateCommand(context, { command: Commands.MOVE_LINE_DOWN, target: 'editor.action.moveLinesDownAction' });
    registerDelegateCommand(context, { command: Commands.DUPLICATE_LINE, target: 'editor.action.copyLinesDownAction' });
    registerDelegateCommand(context, { command: Commands.INSERT_LINE_BEFORE, target: 'editor.action.insertLineBefore' });
    registerDelegateCommand(context, { command: Commands.INSERT_LINE_AFTER, target: 'editor.action.insertLineAfter' });
    registerDelegateCommand(context, { command: Commands.SORT_ASCENDING, target: 'editor.action.sortLinesAscending' });
    registerDelegateCommand(context, { command: Commands.SORT_DESCENDING, target: 'editor.action.sortLinesDescending' });
    registerDelegateCommand(context, { command: Commands.JOIN_LINES, target: 'editor.action.joinLines' });

    // ===== Own transformations =====
    registerTextCommand(context, { command: Commands.CLEAN_WHITESPACE, transform: (text) => cleanWhitespace(text) });
    registerTextCommand(context, { command: Commands.CLEAN_LINE_ENDINGS, transform: (text) => cleanLineEndings(text) });
    registerTextCommand(context, { command: Commands.TRIM_LINES, transform: (text) => trimLines(text) });
    registerTextCommand(context, { command: Commands.LINE_ENDINGS_TO_SPACES, transform: (text) => lineEndingsToSpaces(text) });
    registerTextCommand(context, { command: Commands.TO_WINDOWS_EOL, transform: (text) => toWindowsEOL(text) });
    registerTextCommand(context, { command: Commands.TO_UNIX_EOL, transform: (text) => toUnixEOL(text) });
    registerTextCommand(context, { command: Commands.TO_MAC_EOL, transform: (text) => toMacEOL(text) });
    registerTextCommand(context, { command: Commands.REMOVE_DUPLICATE_LINES, transform: (text) => removeDuplicateLines(text) });
    registerTextCommand(context, { command: Commands.REVERSE_LINES, transform: (text) => reverseLines(text) });
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

    registerInfoCommand(context, { command: Commands.COUNT_WORDS, info: () => vscode.l10n.t('Words: {0}', countWords(getSelection() || getDocumentText())) });
    registerInfoCommand(context, { command: Commands.COUNT_CHARACTERS, info: () => vscode.l10n.t('Characters: {0}', countCharacters(getSelection() || getDocumentText())) });
    registerInfoCommand(context, { command: Commands.COUNT_LINES, info: () => vscode.l10n.t('Lines: {0}', countLines(getSelection() || getDocumentText())) });

    registerInsertCommand(context, { command: Commands.INSERT_SHORT_TIME, insert: () => formatShortDateTime(vscode.env.language) });
    registerInsertCommand(context, { command: Commands.INSERT_LONG_TIME, insert: () => formatLongDateTime(vscode.env.language) });
    registerInsertCommand(context, { command: Commands.INSERT_DATE_TIME, insert: formatCustomDateTime });
    registerInsertCommand(context, { command: Commands.LOREM_IPSUM, insert: () => generateLoremIpsum(vscode.workspace.getConfiguration('pancho').get<number>('loremIpsumWordCount', 50)) });
    registerInsertCommand(context, { command: Commands.GENERATE_UUID, insert: () => generateUUID() });
    registerInsertCommand(context, { command: Commands.GENERATE_RANDOM_STRING, insert: () => generateRandomString(vscode.workspace.getConfiguration('pancho').get<number>('randomStringLength', 16)) });

    registerDocumentCommand(context, { command: Commands.DELETE_LINES_CONTAINING, transform: (text, pattern) => deleteLinesContaining(text, pattern) });
    registerDocumentCommand(context, { command: Commands.KEEP_ONLY_LINES_CONTAINING, transform: (text, pattern) => keepOnlyLinesContaining(text, pattern) });

    registerTextCommand(context, { command: Commands.ESCAPE_JSON, transform: (text) => escapeJSON(text) });
    registerTextCommand(context, { command: Commands.UNESCAPE_JSON, transform: (text) => unescapeJSON(text) });
    registerTextCommand(context, { command: Commands.ESCAPE_FOR_SQL, transform: (text) => escapeForSQL(text) });
    registerTextCommand(context, { command: Commands.UNESCAPE_FOR_SQL, transform: (text) => unescapeForSQL(text) });
    registerTextCommand(context, { command: Commands.ESCAPE_FOR_REGEX, transform: (text) => escapeForRegex(text) });
    registerTextCommand(context, { command: Commands.ESCAPE_FOR_HTML, transform: (text) => escapeForHTML(text) });
    registerTextCommand(context, { command: Commands.UNESCAPE_FOR_HTML, transform: (text) => unescapeForHTML(text) });

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

    registerTextCommand(context, { command: Commands.CSV_TO_JSON, transform: (text) => csvToJSON(text) });
    registerTextCommand(context, { command: Commands.JSON_TO_CSV, transform: (text) => jsonToCSV(text) });
    registerTextCommand(context, { command: Commands.CSV_TO_TSV, transform: (text) => csvToTSV(text) });
    registerTextCommand(context, { command: Commands.TSV_TO_CSV, transform: (text) => tsvToCSV(text) });
    registerTextCommand(context, { command: Commands.CSV_TO_MARKDOWN, transform: (text) => csvToMarkdown(text) });
    registerTextCommand(context, { command: Commands.MARKDOWN_TABLE_TO_CSV, transform: (text) => markdownTableToCSV(text) });

    registerPromptCommand(context, {
        command: Commands.ALIGN_BY_CHAR,
        prompts: [{ label: vscode.l10n.t('Character to align by'), placeholder: '=' }],
        transform: (text, char) => alignByChar(text, char || '='),
    });
    registerTextCommand(context, { command: Commands.ALIGN_EQUALS, transform: (text) => alignEquals(text) });
    registerTextCommand(context, { command: Commands.ALIGN_COLONS, transform: (text) => alignColons(text) });

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
        transform: (text, pattern, flags) => formatRegexResult(pattern, flags || 'g', text, getRegexTimeoutMs()),
    });
}
