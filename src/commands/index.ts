import * as vscode from 'vscode';
import { Commands } from './registry';
import { registerTextCommand, registerInsertCommand, registerInfoCommand } from './factory';
import { getSelection, getDocumentText } from '../utils/editor';
import { cleanWhitespace } from '../transforms/whitespace';
import { cleanLineEndings, lineEndingsToSpaces } from '../transforms/lineEndings';
import { toUpper, toLower, toTitleCase } from '../transforms/case';
import { tabsToSpaces, spacesToTabs, increaseIndent, decreaseIndent } from '../transforms/tabs';
import { trimLines } from '../transforms/lineUtils';
import { formatShortDateTime, formatLongDateTime, formatCustomDateTime } from '../transforms/dateTime';
import { commentLine, uncommentLine, commentBlock, uncommentBlock } from '../transforms/comments';
import { removeDuplicateLines, sortLinesAscending, sortLinesDescending, reverseLines, joinLines, removeEmptyLines } from '../transforms/lines';
import { toWindowsEOL, toUnixEOL, toMacEOL } from '../transforms/eol';
import { pasteWithoutLineBreak, copyToMultipleLines, formatAsCSV, SPECIAL_CHARACTERS } from '../transforms/specialPaste';
import { countWords, countCharacters, countLines, removeDuplicateWords, numberLines, removeLineNumbers, slugify, reverseWords, randomizeLines } from '../transforms/textGeneral';
import { minifyJSON, prettifyJSON, minifyHTML, prettifyHTML, minifyCSS, prettifyCSS, minifyJS, prettifyJS, htmlEntitiesEncode, htmlEntitiesDecode, base64Encode, base64Decode, urlEncode, urlDecode, hexToRgb, rgbToHex, generateLoremIpsum } from '../transforms/webDev';
import { formatSQL, prettifyXML, minifyXML, generateUUID, generateRandomString, hashMD5, hashSHA256, toBinary, fromBinary, toHex, fromHex } from '../transforms/programmer';

export function registerAllCommands(context: vscode.ExtensionContext): void {
    registerTextCommand(context, {
        command: Commands.CLEAN_WHITESPACE,
        transform: (text) => cleanWhitespace(text),
    });

    registerTextCommand(context, {
        command: Commands.CLEAN_LINE_ENDINGS,
        transform: (text) => cleanLineEndings(text),
    });

    registerTextCommand(context, {
        command: Commands.CONVERT_TABS_TO_SPACES,
        transform: (text, tabSize) => tabsToSpaces(text, tabSize),
    });

    registerTextCommand(context, {
        command: Commands.CONVERT_SPACES_TO_TABS,
        transform: (text, tabSize) => spacesToTabs(text, tabSize),
    });

    registerTextCommand(context, {
        command: Commands.TO_UPPER_CASE,
        transform: (text) => toUpper(text),
    });

    registerTextCommand(context, {
        command: Commands.TO_LOWER_CASE,
        transform: (text) => toLower(text),
    });

    registerTextCommand(context, {
        command: Commands.TO_TITLE_CASE,
        transform: (text) => toTitleCase(text),
    });

    registerTextCommand(context, {
        command: Commands.TRIM_LINES,
        transform: (text) => trimLines(text),
    });

    registerTextCommand(context, {
        command: Commands.LINE_ENDINGS_TO_SPACES,
        transform: (text) => lineEndingsToSpaces(text),
    });

    registerTextCommand(context, {
        command: Commands.INCREASE_INDENT,
        transform: (text, tabSize) => increaseIndent(text, tabSize),
    });

    registerTextCommand(context, {
        command: Commands.DECREASE_INDENT,
        transform: (text, tabSize) => decreaseIndent(text, tabSize),
    });

    registerInsertCommand(context, {
        command: Commands.INSERT_SHORT_TIME,
        insert: formatShortDateTime,
    });

    registerInsertCommand(context, {
        command: Commands.INSERT_LONG_TIME,
        insert: formatLongDateTime,
    });

    registerInsertCommand(context, {
        command: Commands.INSERT_DATE_TIME,
        insert: formatCustomDateTime,
    });

    registerTextCommand(context, {
        command: Commands.COMMENT_LINE,
        transform: (text) => commentLine(text),
    });

    registerTextCommand(context, {
        command: Commands.UNCOMMENT_LINE,
        transform: (text) => uncommentLine(text),
    });

    registerTextCommand(context, {
        command: Commands.COMMENT_BLOCK,
        transform: (text) => commentBlock(text),
    });

    registerTextCommand(context, {
        command: Commands.UNCOMMENT_BLOCK,
        transform: (text) => uncommentBlock(text),
    });

    registerTextCommand(context, {
        command: Commands.REMOVE_DUPLICATE_LINES,
        transform: (text) => removeDuplicateLines(text),
    });

    registerTextCommand(context, {
        command: Commands.SORT_ASCENDING,
        transform: (text) => sortLinesAscending(text),
    });

    registerTextCommand(context, {
        command: Commands.SORT_DESCENDING,
        transform: (text) => sortLinesDescending(text),
    });

    registerTextCommand(context, {
        command: Commands.REVERSE_LINES,
        transform: (text) => reverseLines(text),
    });

    registerTextCommand(context, {
        command: Commands.JOIN_LINES,
        transform: (text) => joinLines(text),
    });

    registerTextCommand(context, {
        command: Commands.REMOVE_EMPTY_LINES,
        transform: (text) => removeEmptyLines(text),
    });

    registerTextCommand(context, {
        command: Commands.TO_WINDOWS_EOL,
        transform: (text) => toWindowsEOL(text),
    });

    registerTextCommand(context, {
        command: Commands.TO_UNIX_EOL,
        transform: (text) => toUnixEOL(text),
    });

    registerTextCommand(context, {
        command: Commands.TO_MAC_EOL,
        transform: (text) => toMacEOL(text),
    });

    registerTextCommand(context, {
        command: Commands.PASTE_WITHOUT_LINE_BREAK,
        transform: (text) => pasteWithoutLineBreak(text),
    });

    registerTextCommand(context, {
        command: Commands.COPY_TO_MULTIPLE_LINES,
        transform: (text) => copyToMultipleLines(text, 10),
    });

    registerTextCommand(context, {
        command: Commands.FORMAT_AS_CSV,
        transform: (text) => formatAsCSV(text),
    });

    registerInsertCommand(context, {
        command: Commands.INSERT_DEGREE,
        insert: () => SPECIAL_CHARACTERS.Degree,
    });

    registerInsertCommand(context, {
        command: Commands.INSERT_COPYRIGHT,
        insert: () => SPECIAL_CHARACTERS.Copyright,
    });

    registerInsertCommand(context, {
        command: Commands.INSERT_REGISTERED,
        insert: () => SPECIAL_CHARACTERS.Registered,
    });

    registerInsertCommand(context, {
        command: Commands.INSERT_TRADEMARK,
        insert: () => SPECIAL_CHARACTERS[' Trademark'],
    });

    registerInsertCommand(context, {
        command: Commands.INSERT_SECTION,
        insert: () => SPECIAL_CHARACTERS.Section,
    });

    registerInsertCommand(context, {
        command: Commands.INSERT_PILCROW,
        insert: () => SPECIAL_CHARACTERS.Pilcrow,
    });

    registerInsertCommand(context, {
        command: Commands.INSERT_ELLIPSIS,
        insert: () => SPECIAL_CHARACTERS.Ellipsis,
    });

    registerInsertCommand(context, {
        command: Commands.INSERT_BULLET,
        insert: () => SPECIAL_CHARACTERS.Bullet,
    });

    registerInsertCommand(context, {
        command: Commands.INSERT_EURO,
        insert: () => SPECIAL_CHARACTERS.Euro,
    });

    registerInsertCommand(context, {
        command: Commands.INSERT_POUND,
        insert: () => SPECIAL_CHARACTERS.Pound,
    });

    registerInsertCommand(context, {
        command: Commands.INSERT_YEN,
        insert: () => SPECIAL_CHARACTERS.Yen,
    });

    registerInfoCommand(context, {
        command: Commands.COUNT_WORDS,
        info: () => {
            const text = getSelection() || getDocumentText();
            return `Palabras: ${countWords(text)}`;
        },
    });

    registerInfoCommand(context, {
        command: Commands.COUNT_CHARACTERS,
        info: () => {
            const text = getSelection() || getDocumentText();
            return `Caracteres: ${countCharacters(text)}`;
        },
    });

    registerInfoCommand(context, {
        command: Commands.COUNT_LINES,
        info: () => {
            const text = getSelection() || getDocumentText();
            return `Líneas: ${countLines(text)}`;
        },
    });

    registerTextCommand(context, {
        command: Commands.REMOVE_DUPLICATE_WORDS,
        transform: (text) => removeDuplicateWords(text),
    });

    registerTextCommand(context, {
        command: Commands.NUMBER_LINES,
        transform: (text) => numberLines(text),
    });

    registerTextCommand(context, {
        command: Commands.REMOVE_LINE_NUMBERS,
        transform: (text) => removeLineNumbers(text),
    });

    registerTextCommand(context, {
        command: Commands.SLUGIFY,
        transform: (text) => slugify(text),
    });

    registerTextCommand(context, {
        command: Commands.REVERSE_WORDS,
        transform: (text) => reverseWords(text),
    });

    registerTextCommand(context, {
        command: Commands.RANDOMIZE_LINES,
        transform: (text) => randomizeLines(text),
    });

    registerTextCommand(context, {
        command: Commands.MINIFY_JSON,
        transform: (text) => minifyJSON(text),
    });

    registerTextCommand(context, {
        command: Commands.PRETTIFY_JSON,
        transform: (text) => prettifyJSON(text),
    });

    registerTextCommand(context, {
        command: Commands.MINIFY_HTML,
        transform: (text) => minifyHTML(text),
    });

    registerTextCommand(context, {
        command: Commands.PRETTIFY_HTML,
        transform: (text) => prettifyHTML(text),
    });

    registerTextCommand(context, {
        command: Commands.MINIFY_CSS,
        transform: (text) => minifyCSS(text),
    });

    registerTextCommand(context, {
        command: Commands.PRETTIFY_CSS,
        transform: (text) => prettifyCSS(text),
    });

    registerTextCommand(context, {
        command: Commands.MINIFY_JS,
        transform: (text) => minifyJS(text),
    });

    registerTextCommand(context, {
        command: Commands.PRETTIFY_JS,
        transform: (text) => prettifyJS(text),
    });

    registerTextCommand(context, {
        command: Commands.HTML_ENTITIES_ENCODE,
        transform: (text) => htmlEntitiesEncode(text),
    });

    registerTextCommand(context, {
        command: Commands.HTML_ENTITIES_DECODE,
        transform: (text) => htmlEntitiesDecode(text),
    });

    registerTextCommand(context, {
        command: Commands.BASE64_ENCODE,
        transform: (text) => base64Encode(text),
    });

    registerTextCommand(context, {
        command: Commands.BASE64_DECODE,
        transform: (text) => base64Decode(text),
    });

    registerTextCommand(context, {
        command: Commands.URL_ENCODE,
        transform: (text) => urlEncode(text),
    });

    registerTextCommand(context, {
        command: Commands.URL_DECODE,
        transform: (text) => urlDecode(text),
    });

    registerTextCommand(context, {
        command: Commands.HEX_TO_RGB,
        transform: (text) => hexToRgb(text),
    });

    registerTextCommand(context, {
        command: Commands.RGB_TO_HEX,
        transform: (text) => rgbToHex(text),
    });

    registerInsertCommand(context, {
        command: Commands.LOREM_IPSUM,
        insert: () => generateLoremIpsum(50),
    });

    registerTextCommand(context, {
        command: Commands.FORMAT_SQL,
        transform: (text) => formatSQL(text),
    });

    registerTextCommand(context, {
        command: Commands.PRETTIFY_XML,
        transform: (text) => prettifyXML(text),
    });

    registerTextCommand(context, {
        command: Commands.MINIFY_XML,
        transform: (text) => minifyXML(text),
    });

    registerInsertCommand(context, {
        command: Commands.GENERATE_UUID,
        insert: () => generateUUID(),
    });

    registerInsertCommand(context, {
        command: Commands.GENERATE_RANDOM_STRING,
        insert: () => generateRandomString(16),
    });

    registerTextCommand(context, {
        command: Commands.HASH_MD5,
        transform: (text) => hashMD5(text),
    });

    registerTextCommand(context, {
        command: Commands.HASH_SHA256,
        transform: (text) => hashSHA256(text),
    });

    registerTextCommand(context, {
        command: Commands.TO_BINARY,
        transform: (text) => toBinary(text),
    });

    registerTextCommand(context, {
        command: Commands.FROM_BINARY,
        transform: (text) => fromBinary(text),
    });

    registerTextCommand(context, {
        command: Commands.TO_HEX,
        transform: (text) => toHex(text),
    });

    registerTextCommand(context, {
        command: Commands.FROM_HEX,
        transform: (text) => fromHex(text),
    });
}