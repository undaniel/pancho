# Changelog

All notable changes to this extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Internationalization (i18n)**: The extension UI now adapts to VS Code's display language.
  - English (default) and Spanish (`es`) translations for all 83 commands, 14 submenus, 7 settings, walkthrough, keybindings and status bar messages.
  - `package.nls.json` + `package.nls.es.json` for the manifest.
  - `l10n/bundle.l10n.json` + `l10n/bundle.l10n.es.json` for runtime strings (errors, warnings, tooltips).
  - `"l10n": "./l10n"` declared in `package.json`.
- `LICENSE` file (MIT).
- npm scripts: `build`, `build:production`, `typecheck`.
- `@vscode/vsce` as devDependency.

### Fixed

- **Critical**: `pancho.minifyHTML/CSS/JS` and `pancho.prettifyHTML/CSS/JS` were running the JSON formatter due to incorrect imports in `commands/index.ts`. Now each language uses its own formatter.
- **Build**: `npm run package` and `npm run publish` now use `@vscode/vsce` (was calling a missing `vsce` binary).
- **Build**: `npm run test:integration` now compiles TypeScript before running tests.
- **Package**: Removed orphan `viewsWelcome` referencing a non-existent `panchoStatusView`.
- **Package**: Status bar now uses the `$(wand)` codicon instead of the unregistered `$(pancho)` icon.
- **Package**: `media/**` is no longer excluded from `.vsix` so walkthrough SVGs are bundled.
- **Package**: Significantly reduced `.vsix` size (excluded `tests/`, `scripts/`, `AGENTS.md`, `README_PANCHO.md`, loose `dist/` files, source maps, etc.).

### Changed

- **Settings**: `pancho.loremIpsumWordCount` and `pancho.randomStringLength` are now respected (were hardcoded).
- **Keybindings (Mac)**: Moved to `Cmd+Alt+...` to avoid conflicts with native VS Code shortcuts (`Cmd+Shift+W` close window, `Cmd+Shift+L` select all occurrences, etc.).
- **Keybindings**: Removed unused `accessibilityInformation.handledChannels` field (only valid for views).
- **Performance**: Status bar counters are debounced (150ms) and capped for large documents (>500K chars).
- **Security**: `generateUUID` and `generateRandomString` now use `crypto.randomUUID()` and `crypto.randomBytes()` instead of `Math.random()`.
- **Code**: Replaced deprecated `String.prototype.substr` with `slice` in `toTitleCase`.

### Removed

- Dead code: `escapeForShell`, `findAllMatches`, `replaceAllMatches`, `splitLine`, `deleteLinesMatchingRegex`, `keepOnlyLinesMatchingRegex`, `insertSpecialCharacter`, `SPECIAL_CHARACTERS`, duplicated `joinLines` in `specialPaste.ts`, unused `sanitizeRegexPattern` and `truncateText`.

### Added

- `LICENSE` file (MIT).
- npm scripts: `build`, `build:production`, `typecheck`.
- `@vscode/vsce` as devDependency.

## [1.0.0] - 2026-05-23

### Added

- **Text Transformation Commands**
  - `pancho.toUpperCase` / `pancho.toLowerCase` / `pancho.toTitleCase`
  - `pancho.trimLines` - Remove leading/trailing whitespace from lines
  - `pancho.cleanWhitespace` - Clean multiple spaces and normalize line breaks
  - `pancho.cleanLineEndings` - Normalize line endings

- **Line Operations**
  - `pancho.removeDuplicateLines` - Remove duplicate lines
  - `pancho.sortAscending` / `pancho.sortDescending` - Sort lines alphabetically
  - `pancho.reverseLines` - Reverse line order
  - `pancho.joinLines` - Join lines with separator
  - `pancho.removeEmptyLines` - Remove empty lines
  - `pancho.moveLineUp` / `pancho.moveLineDown` - Move lines within document

- **Encoding & Decoding**
  - `pancho.base64Encode` / `pancho.base64Decode`
  - `pancho.urlEncode` / `pancho.urlDecode`
  - `pancho.htmlEntitiesEncode` / `pancho.htmlEntitiesDecode`

- **Hash Functions**
  - `pancho.hashMD5` - MD5 hash (with security warning)
  - `pancho.hashSHA256` - SHA-256 hash (with security warning)
  - `pancho.toBinary` / `pancho.fromBinary`
  - `pancho.toHex` / `pancho.fromHex`

- **Formatting**
  - `pancho.minifyJSON` / `pancho.prettifyJSON`
  - `pancho.minifyHTML` / `pancho.prettifyHTML`
  - `pancho.minifyCSS` / `pancho.prettifyCSS`
  - `pancho.minifyJS` / `pancho.prettifyJS`
  - `pancho.formatSQL`
  - `pancho.prettifyXML` / `pancho.minifyXML`

- **Text Analysis**
  - `pancho.countWords` - Word counter
  - `pancho.countCharacters` - Character counter
  - `pancho.countLines` - Line counter

- **Line Editing**
  - `pancho.duplicateLine` - Duplicate current line
  - `pancho.insertLineBefore` / `pancho.insertLineAfter`
  - `pancho.deleteLinesContaining` / `pancho.keepOnlyLinesContaining`

- **Escaping**
  - `pancho.escapeJSON` / `pancho.unescapeJSON`
  - `pancho.escapeForSQL` / `pancho.unescapeForSQL`
  - `pancho.escapeForRegex`
  - `pancho.escapeForHTML` / `pancho.unescapeForHTML`

- **Insert Commands**
  - `pancho.insertShortTime` / `pancho.insertLongTime` / `pancho.insertDateTime`
  - `pancho.loremIpsum` - Generate Lorem Ipsum text
  - `pancho.generateUUID` - Generate UUID
  - `pancho.generateRandomString` - Generate random string

- **Comment Commands**
  - `pancho.commentLine` / `pancho.uncommentLine`
  - `pancho.commentBlock` / `pancho.uncommentBlock`

- **Tab Operations**
  - `pancho.convertTabsToSpaces` / `pancho.convertSpacesToTabs`
  - `pancho.increaseIndent` / `pancho.decreaseIndent`

- **End of Line Operations**
  - `pancho.toWindowsEOL` (CRLF)
  - `pancho.toUnixEOL` (LF)
  - `pancho.toMacEOL` (CR)

- **Keybindings** - Shortcuts for common operations
  - `Ctrl+Shift+U` - Uppercase
  - `Ctrl+Shift+L` - Lowercase
  - `Ctrl+Shift+T` - Trim lines
  - `Ctrl+Shift+W` - Count words
  - `Ctrl+Shift+C` - Count characters
  - `Ctrl+Shift+N` - Count lines
  - `Ctrl+Shift+S` - Sort ascending
  - `Ctrl+Shift+D` - Remove duplicates

### Security

- Hash functions (`hashMD5`, `hashSHA256`) include security warnings
- SQL escaping properly handles single quotes

### Bug Fixes

- `moveLineUp` / `moveLineDown` now use proper line index instead of text search
- `splitLine` regex pattern corrected
- Error handling added to `unescapeJSON` and `unescapeForHTML`
- Selection-aware commands respect text selections

### Testing

- 84 unit tests for transform functions
- Integration test suite for VS Code API
- Test coverage reporting

### Documentation

- Complete README with all commands documented
- Extension guide for adding new commands
- Local installation and packaging instructions