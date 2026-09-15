# Pancho

[![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)](./CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![VSCode Engine](https://img.shields.io/badge/VSCode-%5E1.80.0-blue.svg)](https://code.visualstudio.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-%5E5.0.0-blue.svg)](https://www.typescriptlang.org/)
[![Marketplace](https://img.shields.io/visual-studio-marketplace/v/undaniels.pancho-plus-plus)](https://marketplace.visualstudio.com/items?itemName=undaniels.pancho-plus-plus)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/undaniels.pancho-plus-plus)](https://marketplace.visualstudio.com/items?itemName=undaniels.pancho-plus-plus)
[![Open VSX](https://img.shields.io/open-vsx/v/undaniels/pancho-plus-plus)](https://open-vsx.org/extension/undaniels/pancho-plus-plus)

> Clean, format and transform text like Notepad++

<img src="./pancho.webp" alt="Pancho" width="256" />

**Language:** English · [Español](./docs/README.es.md)

**Contents:** [Install](#install) · [Features](#features) · [Top 10](#top-10-commands) · [Why Pancho?](#why-pancho) · [Privacy](#privacy--security) · [How to use](#how-to-use) · [Commands](#commands) · [Demos](./docs/demos.md) · [Shortcuts](#keyboard-shortcuts) · [Settings](#settings) · [Contributing](#contributing)

---

## Install

- **VS Code Marketplace:** [Pancho++](https://marketplace.visualstudio.com/items?itemName=undaniels.pancho-plus-plus)
- **Open VSX:** [undaniels/pancho-plus-plus](https://open-vsx.org/extension/undaniels/pancho-plus-plus)
- Or run `ext install undaniels.pancho-plus-plus`.

---

## Features

- **138 commands** available from the context menu
- **Command hub** (`Pancho: Show command menu`) with categories, shortcuts and recently used
- **Multi-cursor & multi-selection** aware: transforms apply per cursor/selection
- **Repeat last command** (`Ctrl+Shift+.`)
- **Diff preview** for destructive commands (opt-in)
- **Column mode**: insert / delete / copy / paste column blocks
- **Macros**: record, replay, save and export/import command sequences
- **Inline hover info**: decode JWTs, timestamps, colors and Base64 just by hovering
- **Quick fixes** (Code Actions): detect JWT / JSON / CSV / hex and convert in place
- **Regex tester panel** with live matches, groups and replace preview
- **Clipboard history** (`Ctrl+Alt+V`) and **sort by column**
- **Safe regex engine** with timeout (no more frozen windows)
- **Status bar counters** (lines, words, characters)
- **Keyboard shortcuts** for frequent operations
- **Settings** for tab size, EOL and more
- **English & Spanish** UI (follows VS Code's display language)

## Top 10 commands

New here? These are the ones people reach for the most:

| Command | What it does | Shortcut |
|---------|--------------|----------|
| Show command menu | Searchable hub of everything Pancho can do | — |
| Sort by column... | Sort CSV/TSV rows by a chosen column | — |
| Remove duplicate lines | De-duplicate a list in one shot | `Ctrl+Shift+D` |
| Regex tester panel | Live matches, groups and replace preview | `Ctrl+Alt+R` |
| Clipboard history... | Re-paste anything you copied recently | `Ctrl+Alt+V` |
| Decode JWT | Decode a token (also available as hover / quick fix) | — |
| Column fill series... | Fill a column with an incrementing series | — |
| CSV to JSON / JSON to CSV | Convert tabular data both ways | — |
| Macro: record & play | Automate repetitive edits | — |
| Align by = | Line up assignments / tables | — |

More examples in [docs/demos.md](./docs/demos.md).

## Why Pancho?

- **Notepad++ muscle memory** in VS Code: the same text operations, in the context menu.
- **Context aware:** hover a JWT/timestamp/color to see it decoded; select JSON/CSV/JWT and get one-click conversions from the lightbulb.
- **Safe by design:** no network, no telemetry, regex in a time-limited worker thread, AES-256-GCM.
- **Small but complete:** one extension for formatting, escaping, hashing, encoding, CSV, macros and columns.

## Privacy & security

- **No telemetry, no network access.** Pancho runs entirely locally and never sends your text anywhere.
- **Safe regex engine.** User-provided regular expressions run in an isolated worker thread with a timeout, so a malicious or accidental catastrophic pattern cannot freeze VS Code.
- **Authenticated encryption.** AES encryption uses AES-256-GCM with a random salt per message (legacy CBC data is still readable).
- **Workspace trust aware.** Pancho declares limited support for untrusted workspaces and requires no network access.

## How to use

1. Select text (or don't, to apply to the whole document)
2. Right-click → **Pancho**
3. Pick a category and a command

## Commands

The **138 commands** are grouped into seven categories so the context menu stays
short: **Edit**, **Lines**, **Text & Case**, **Convert**, **Escape**, **Dev tools** and
**Macros & Columns**, plus the **Command hub**.

Full list with descriptions: **[docs/commands.md](./docs/commands.md)** (English) ·
**[docs/commands.es.md](./docs/commands.es.md)** (Español).

## VS Code integrations

Some commands keep Pancho's menu entry and shortcut but **delegate to VS Code's native implementation** (consistency and multi-cursor support): uppercase / lowercase / title case, comment & block comment, tabs↔spaces, indent/outdent, move / duplicate / insert line, sort A–Z / Z–A and join lines.

## Keyboard shortcuts

| Win/Linux | Mac | Command |
|-------|-------|---------|
| `Ctrl+Shift+U` | `Cmd+Shift+U` | Uppercase |
| `Ctrl+Shift+L` | `Cmd+Alt+L` | Lowercase |
| `Ctrl+Shift+T` | `Cmd+Alt+T` | Trim lines |
| `Ctrl+Shift+W` | `Cmd+Alt+W` | Count words |
| `Ctrl+Shift+C` | `Cmd+Alt+C` | Count characters |
| `Ctrl+Shift+N` | `Cmd+Alt+N` | Count lines |
| `Ctrl+Shift+S` | `Cmd+Alt+S` | Sort A-Z |
| `Ctrl+Shift+D` | `Cmd+Alt+D` | Remove duplicates |
| `Ctrl+Shift+.` | `Cmd+Shift+.` | Repeat last command |
| `Ctrl+Alt+V` | `Cmd+Alt+V` | Clipboard history |
| `Ctrl+Alt+R` | `Cmd+Alt+R` | Regex tester panel |

> Mac shortcuts use `Cmd+Alt+...` to avoid clashing with native VS Code shortcuts (`Cmd+Shift+W` closes the window, etc.).
>
> Some defaults collide with OS or editor shortcuts on certain platforms (`Ctrl+Shift+U` is "insert Unicode" on Linux, `Ctrl+Shift+S` is "Save As" in some editors). If that bothers you, remap them in **Keyboard Shortcuts** (`Ctrl+K Ctrl+S`) by searching for `pancho`.

## Settings

| Option | Default | Description |
|--------|---------|-------------|
| `pancho.tabSize` | `4` | Tab size |
| `pancho.defaultEOL` | `LF` | Default end of line |
| `pancho.statusBarShowCounters` | `true` | Show counters |
| `pancho.maxFileSizeKB` | `5120` | Max file size to process |
| `pancho.loremIpsumWordCount` | `50` | Lorem Ipsum word count |
| `pancho.randomStringLength` | `16` | Random string length |
| `pancho.regexTimeoutMs` | `2000` | Max time (ms) a regex may run before aborting |
| `pancho.previewDestructive` | `false` | Show a diff preview before destructive commands |
| `pancho.clipboardHistoryEnabled` | `true` | Record the clipboard in the background |
| `pancho.clipboardHistorySize` | `20` | Max clipboard entries to keep |

## Status bar counters

Pancho shows `L:X P:Y C:Z` (Lines, Words, Characters) in the status bar. When there is a selection it switches to `Sel L:X P:Y C:Z` so you can tell selection counts from document totals at a glance.

## Demos

Step-by-step examples (hover, quick fixes, regex panel, columns, clipboard, sorting,
macros): **[docs/demos.md](./docs/demos.md)**.

---

## Contributing

Issues and pull requests are welcome at [github.com/undaniel/pancho](https://github.com/undaniel/pancho).

```bash
npm install
npm run compile   # typecheck
npm test          # unit tests
npm run l10n:check
npm run bundle    # build dist/
```

Then press `F5` in VS Code to launch the Extension Development Host. See [CHANGELOG.md](./CHANGELOG.md) for release history.

## License

[MIT](./LICENSE) © Daniel Carrasco

---

**¿Te gusta Pancho? / Do you like Pancho?** Deja una reseña en el Marketplace · Leave a review on the Marketplace.
