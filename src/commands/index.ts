import * as vscode from 'vscode';
import { Commands } from './registry';
import { registerTextCommand, registerInsertCommand } from './factory';
import { cleanWhitespace } from '../transforms/whitespace';
import { cleanLineEndings, lineEndingsToSpaces } from '../transforms/lineEndings';
import { toUpper, toLower, toTitleCase } from '../transforms/case';
import { tabsToSpaces, spacesToTabs, increaseIndent, decreaseIndent } from '../transforms/tabs';
import { trimLines } from '../transforms/lineUtils';
import { formatShortDateTime, formatLongDateTime, formatCustomDateTime } from '../transforms/dateTime';
import { commentLine, uncommentLine, commentBlock, uncommentBlock } from '../transforms/comments';

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
}