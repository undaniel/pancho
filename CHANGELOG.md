# Changelog

All notable changes to this extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `pancho.columnFillSeries` — fill a column block with an incrementing series (start/step).
- `pancho.repeatLastTimes` — repeat the last command a chosen number of times.
- `pancho.sortByColumn` — sort rows by a chosen column (delimiter + index + numeric).
- `pancho.clipboardHistory` (keybinding `Ctrl+Alt+V`) — pick and paste a previous clipboard entry.
- `pancho.regexTesterPanel` (keybinding `Ctrl+Alt+R`) — Webview panel with live matches, groups and replace preview + apply.
- `pancho.macroExport` / `pancho.macroImport` — share saved macros as JSON.
- **Hover provider:** hovering a JWT, timestamp, hex/RGB color or printable Base64 shows the decoded value inline.
- **Code Actions provider:** selecting a JWT / JSON / CSV / color / Base64 / timestamp offers one-click Pancho conversions (`Ctrl+.`).
- Command hub now shows a **Recently used** category on top.
- Settings `pancho.clipboardHistoryEnabled` / `pancho.clipboardHistorySize`.
- Command palette grouping via `category: Pancho` and `enablement: editorIsOpen` (editor commands are disabled without an editor).
- Context-menu `when` clauses: column commands only appear with multiple selections; keep/remove-lines only with a selection.
- `npm run l10n:check` and a unit test that fail when a runtime string is missing from `l10n/bundle.l10n.json`.
- Macro guardrails: cannot start recording while playing, cannot play while recording/playing.

### Changed

- **Native delegation:** 17 commands keep their Pancho menu entry and keyboard shortcut but now delegate to VS Code's own implementation (consistency + native multi-cursor): uppercase/lowercase/title case, comment & block comment, tabs↔spaces, indent/outdent, move / duplicate / insert line, sort A–Z / Z–A and join lines.
- Status bar counters now show `Sel L:x P:y C:z` while there is a selection, and hide when there is no active editor.
- The regex worker is pre-warmed on activation so the first regex does not pay the thread-spawn cost.
- Localized previously hardcoded error strings (`align`, `convert`, `jwt`, `timestamp`, `colorInfo`).
- Removed the oversized `.vsix` binaries and `README_PANCHO.md` from the repository (use GitHub Releases); `.DS_Store` untracked.

### Removed

- Commands already provided by VS Code: `uncommentLine` / `uncommentBlock` (native comment toggle), `findInFiles` / `replaceInFiles` (native global search/replace), `highlightMatches` / `countMatches` (find widget), `encodingInfo` / `changeEncoding` (status bar / native command).
- Now-unused modules and their tests: `transforms/comments`, `transforms/commentStyles`, `transforms/tabs`, `transforms/search`, `transforms/searchAdvanced`, `features/encoding`, `commands/encoding`.
- **Total commands:** 141 → 138 (after removing 8 redundant and adding 5 new).

### Testing

- 245 unit tests.

### Docs

- **Restructured documentation** so the Marketplace README stays short (653 → 164 lines):
  - `README.md` — English overview: install, features, top 10, why, privacy, how to use, shortcuts, settings, contributing.
  - `docs/commands.md` / `docs/commands.es.md` — the full 138-command reference.
  - `docs/README.es.md` — the Spanish guide.
  - `docs/demos.md` — hover, quick fixes, regex panel, columns, clipboard, sorting and macros examples.
- README: install/why/top-10 sections, Marketplace & Open VSX badges, table of contents, contributing guide and keyboard-shortcut conflict notes; removed stale claims for deleted commands.
- `.vscodeignore`: also ignore `**/*.vsix` and `.github/**`.

## [1.3.0] - 2026-09-14

Major release focused on safety, multi-cursor support, UX and Notepad++-style power features.

### Added

- **Command hub:**
  - `pancho.showMenu` — Quick Pick hub with all categories and commands (built from the manifest, showing shortcuts). Localized.

- **Repeat last command:**
  - `pancho.repeatLast` (keybinding `Ctrl+Shift+.` / `Cmd+Shift+.`), backed by workspace state.

- **Diff preview for destructive commands:**
  - `pancho.previewDestructive` (opt-in) opens a side-by-side diff before applying ~50 structural commands.
  - `replaceInFiles` now performs a **dry-run** and confirms with the real count: *"Replace N matches in M files?"*.

- **Multi-cursor & multi-selection support:**
  - Text, prompt, insert and line commands now apply **per cursor/selection**; an empty cursor expands to its whole line. Overlapping ranges are merged and a single undo step is used.
  - Insert commands insert at **every** cursor.

- **Column mode:**
  - `pancho.columnInsert` / `pancho.columnDelete` / `pancho.columnCopy` / `pancho.columnPaste` — operate on a column block (Alt+drag selections).

- **Macros:**
  - `pancho.macroStart` / `macroStop` / `macroPlay` / `macroSave` / `macroLoad` / `macroList` — record and replay Pancho commands and generated insertions; persists to global state.

- **Encoding tools:**
  - `pancho.encodingInfo` — detect BOM (UTF-8/UTF-16 LE/BE), UTF-8 validity and Latin-1 fallback.
  - `pancho.changeEncoding` — change/reopen the file with another encoding (delegates to VS Code).

- **Regex line filters:**
  - `pancho.filterLinesByRegex` / `pancho.removeLinesByRegex` — keep/remove lines matching a regex (safe engine).

- **Settings:** `pancho.regexTimeoutMs` (default `2000`), `pancho.previewDestructive` (default `false`).

- **Security test** that fails the build if `eval`, `new Function`, `child_process` or network modules appear in `src/`.

### Changed

- **Total commands:** 124 → 139.
- **AES:** encryption now uses **AES-256-GCM** with a random salt per message and PBKDF2-SHA256 (210,000 iterations). Legacy CBC data is still decryptable.
- **Regex safety:** user patterns now run in an isolated **worker thread with a configurable timeout**, plus a catastrophic-backtracking pre-check, so a bad pattern can no longer freeze VS Code.
- **Workspace trust:** `replaceInFiles` is disabled in untrusted workspaces; the extension declares `untrustedWorkspaces: limited`.
- **Performance:** status bar counters are cached per document version (no full re-read when only moving the cursor); `naturalCompare` is now O(n log n); removed the `Math.max(...array)` spread.
- **Cancellation:** find/replace in files honor the progress cancellation token.
- **Editor defaults:** removed the global `configurationDefaults` that forced `tabSize: 4` / `insertSpaces` on every file.
- **i18n:** date/time uses the VS Code display language (was hardcoded `es-ES`); counter messages and submenu labels are now localized.

### Fixed

- `spacesToTabs` no longer drops characters when indentation doesn't complete a tab stop.
- `formatSQL` now preserves line breaks instead of collapsing everything to one line.
- Insert commands no longer insert text when the transform returns an error.
- Errors now take precedence over warnings; prompt warnings are surfaced.
- `deleteLinesContaining` / `keepOnlyLinesContaining` / `highlightMatches` no longer re-read the selection as the input (the selection is the pattern; the whole document is the target, and an empty pattern is rejected).

### Security

- Isolated regex execution with timeout and complexity pre-validation.
- Authenticated encryption (AES-256-GCM) with per-message random salt.
- Hard caps on `loremIpsumWordCount` (100,000) and `randomStringLength` (10,000).
- Workspace-trust gating for mass file replacement.
- Privacy section in the README (no telemetry, no network access).

### Removed

- Dead code: orphan in-extension test runner (`src/test/suite.ts`), unused `src/transforms/spaces.ts`, and unused `statusBar` message helpers.

### Testing

- 260 unit tests (was 84); ~81% statement coverage of `src/transforms`.
- Added tests for regex safety, AES-GCM (+ legacy), plan/column/macro/encoding cores, the command factory contracts, menu catalog and a privacy/security guard.

## [1.2.0] - 2026-06-21

### Added

- **Case conversions (8 new):**
  - `pancho.toSentenceCase` / `pancho.invertCase` / `pancho.randomCase`
  - `pancho.toKebabCase` / `pancho.toSnakeCase` / `pancho.toCamelCase` / `pancho.toPascalCase` / `pancho.toConstantCase`

- **Text operations:**
  - `pancho.removeDiacritics` — Remove accents and diacritical marks
  - `pancho.stripHTMLTags` — Strip HTML tags from text
  - `pancho.wrapText` / `pancho.unwrapText` — Wrap/unwrap text at column width

- **Advanced sorting:**
  - `pancho.sortNatural` / `pancho.sortNaturalDescending` — Natural sort (`file2` < `file10`)
  - `pancho.sortByLength` / `pancho.sortByLengthDescending` — Sort by line length
  - `pancho.sortNumeric` — Numeric sort
  - `pancho.removeConsecutiveDuplicateLines` — Remove only adjacent duplicates

- **Transpose:**
  - `pancho.transposeCharacters` / `pancho.transposeWords` / `pancho.transposeLines`

- **CSV / Markdown conversions:**
  - `pancho.csvToJSON` / `pancho.jsonToCSV` / `pancho.csvToTSV` / `pancho.tsvToCSV`
  - `pancho.csvToMarkdown` / `pancho.markdownTableToCSV`

- **Column alignment:**
  - `pancho.alignByChar` / `pancho.alignEquals` / `pancho.alignColons`

- **Developer tools:**
  - `pancho.decodeJWT` — Decode JWT tokens (header + payload + expiry check)
  - `pancho.timestampToISO` / `pancho.isoToTimestamp` / `pancho.nowAsTimestamp`
  - `pancho.aesEncrypt` / `pancho.aesDecrypt` — AES-256-CBC with PBKDF2
  - `pancho.colorInfo` — Show HEX + RGB + HSL for a color
  - `pancho.regexTester` — Test regex with groups and match count

- **Search in workspace:**
  - `pancho.findInFiles` — Search across all workspace files (results in OutputChannel)
  - `pancho.replaceInFiles` — Replace across all workspace files (with confirmation)

- **New submenus:** Search, Developer Tools

### Changed

- **Total commands:** 83 → 124 (41 new commands)
- README bilingual updated with all new commands
- NLS and l10n bundles updated (EN + ES)

## [1.1.0] - 2026-06-21

### Added

- **Internationalization (i18n)**: The extension UI now adapts to VS Code's display language.
  - English (default) and Spanish (`es`) translations for all commands, submenus, settings, walkthrough, keybindings and status bar messages.
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