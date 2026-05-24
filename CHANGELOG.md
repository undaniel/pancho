# Changelog

All notable changes to this extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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