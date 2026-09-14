# Pancho commands

Full list of the **138 commands** shipped by Pancho, grouped by the same categories
you see in the context menu (`Right-click → Pancho`). Every command is also
available from the Command Palette under `Pancho:`.

> [!TIP]
> The in-editor **command hub** (`Pancho: Show command menu`) lists the same
> categories with their keyboard shortcuts and your recently used commands.

- [Editing](#editing)
- [Lines](#lines)
- [Case](#case)
- [Indentation](#indentation)
- [End of line](#end-of-line)
- [General text](#general-text)
- [Encoding](#encoding)
- [Formatting](#formatting)
- [Hash & binary](#hash--binary)
- [Insert](#insert)
- [Comment](#comment--uncomment)
- [Developers](#developers)
- [Columns](#columns)
- [Macros](#macros)
- [Escape](#escape)
- [Developer Tools](#developer-tools)
- [Command hub](#command-hub)

## Editing
| Command | Description |
|---------|-------------|
| `Pancho: Clean whitespace` | Remove multiple spaces |
| `Pancho: Clean line endings` | Normalize line endings |
| `Pancho: Trim lines` | Trim leading/trailing whitespace |
| `Pancho: Convert line endings to spaces` | Line breaks → spaces |
| `Pancho: Wrap text...` | Wrap at column width |
| `Pancho: Unwrap text` | Remove line breaks |

## Lines
| Command | Description |
|---------|-------------|
| `Pancho: Remove duplicate lines` | Remove all duplicates |
| `Pancho: Remove consecutive duplicate lines` | Remove only adjacent duplicates |
| `Pancho: Sort A-Z` | Sort ascending |
| `Pancho: Sort Z-A` | Sort descending |
| `Pancho: Sort natural` | Natural sort (`file2` < `file10`) |
| `Pancho: Sort natural descending` | Natural sort reverse |
| `Pancho: Sort by length` | Shortest first |
| `Pancho: Sort by length descending` | Longest first |
| `Pancho: Sort numeric` | Numeric ascending |
| `Pancho: Sort by column...` | Sort rows by a column (delimiter + index + numeric) |
| `Pancho: Reverse lines` | Reverse order |
| `Pancho: Randomize lines` | Shuffle lines |
| `Pancho: Join lines` | Join into a single line |
| `Pancho: Remove empty lines` | Remove blank lines |

## Case
| Command | Description |
|---------|-------------|
| `Pancho: Convert to UPPERCASE` | UPPERCASE |
| `Pancho: Convert to lowercase` | lowercase |
| `Pancho: Convert to Title Case` | Title Case |
| `Pancho: Convert to sentence case` | Sentence case |
| `Pancho: Invert case` | Swap upper/lower |
| `Pancho: Random case` | Random upper/lower |
| `Pancho: Convert to camelCase` | camelCase |
| `Pancho: Convert to PascalCase` | PascalCase |
| `Pancho: Convert to snake_case` | snake_case |
| `Pancho: Convert to kebab-case` | kebab-case |
| `Pancho: Convert to CONSTANT_CASE` | CONSTANT_CASE |

## Indentation
| Command | Description |
|---------|-------------|
| `Pancho: Convert tabs to spaces` | Tabs → spaces |
| `Pancho: Convert spaces to tabs` | Spaces → tabs |
| `Pancho: Increase indent` | Increase indent |
| `Pancho: Decrease indent` | Decrease indent |

## End of line
| Command | Description |
|---------|-------------|
| `Pancho: Convert to Windows (CRLF)` | Windows format |
| `Pancho: Convert to Unix (LF)` | Unix/Mac format |
| `Pancho: Convert to Mac (CR)` | Classic Mac format |

## General text
| Command | Description |
|---------|-------------|
| `Pancho: Count words` | Count words |
| `Pancho: Count characters` | Count characters |
| `Pancho: Count lines` | Count lines |
| `Pancho: Remove duplicate words` | Remove duplicate words |
| `Pancho: Number lines` | Add line numbers |
| `Pancho: Remove line numbers` | Remove line numbers |
| `Pancho: Generate URL slug` | Generate URL slug |
| `Pancho: Reverse words` | Reverse word order |
| `Pancho: Randomize lines` | Shuffle lines |
| `Pancho: Paste without line break` | Paste without breaks |
| `Pancho: Copy to multiple lines` | Copy to multiple lines |
| `Pancho: Clipboard history...` | Pick and paste a previous clipboard entry |
| `Pancho: Format as CSV` | Format as CSV |
| `Pancho: Remove diacritics` | Remove accents |
| `Pancho: Strip HTML tags` | Strip HTML tags |
| `Pancho: CSV to JSON` | CSV → JSON |
| `Pancho: JSON to CSV` | JSON → CSV |
| `Pancho: CSV to TSV` | CSV → TSV |
| `Pancho: TSV to CSV` | TSV → CSV |
| `Pancho: CSV to Markdown table` | CSV → Markdown table |
| `Pancho: Markdown table to CSV` | Markdown table → CSV |
| `Pancho: Keep lines matching regex...` | Keep only matching lines |
| `Pancho: Remove lines matching regex...` | Remove matching lines |

## Encoding
| Command | Description |
|---------|-------------|
| `Pancho: Base64 encode` | Encode to Base64 |
| `Pancho: Base64 decode` | Decode from Base64 |
| `Pancho: URL encode` | URL-encode |
| `Pancho: URL decode` | URL-decode |
| `Pancho: HTML entities encode` | Escape HTML characters |
| `Pancho: HTML entities decode` | Unescape HTML |

## Formatting
| Command | Description |
|---------|-------------|
| `Pancho: Minify JSON` | Minify JSON |
| `Pancho: Prettify JSON` | Pretty-print JSON |
| `Pancho: Minify HTML` | Minify HTML |
| `Pancho: Prettify HTML` | Pretty-print HTML |
| `Pancho: Minify CSS` | Minify CSS |
| `Pancho: Prettify CSS` | Pretty-print CSS |
| `Pancho: Minify JavaScript` | Minify JS |
| `Pancho: Prettify JavaScript` | Pretty-print JS |
| `Pancho: Format SQL` | Format SQL |
| `Pancho: Prettify XML` | Pretty-print XML |
| `Pancho: Minify XML` | Minify XML |

> For JS/TS/JSON/HTML/CSS, VS Code's built-in **Format Document** is syntax-aware and more complete. Pancho's formatters are lightweight (regex-based) and add **minify**, which VS Code does not provide.

## Hash & binary
| Command | Description |
|---------|-------------|
| `Pancho: MD5 hash` | MD5 hash |
| `Pancho: SHA-256 hash` | SHA-256 hash |
| `Pancho: Text to binary` | Text → binary |
| `Pancho: Binary to text` | Binary → text |
| `Pancho: Text to hex` | Text → hex |
| `Pancho: Hex to text` | Hex → text |
| `Pancho: Hex to RGB` | Hex color → RGB |
| `Pancho: RGB to Hex` | RGB → Hex color |

## Insert
| Command | Description |
|---------|-------------|
| `Pancho: Short date/time` | Short date/time |
| `Pancho: Long date/time` | Long date/time |
| `Pancho: Date/time (dd-MM-yyyy hh:mm:ss)` | Custom date/time |
| `Pancho: Generate Lorem Ipsum` | Lorem Ipsum filler |
| `Pancho: Generate UUID` | UUID v4 |
| `Pancho: Generate random string` | Random string |

## Comment / Uncomment
| Command | Description |
|---------|-------------|
| `Pancho: Comment line` | Toggle line comment (delegates to VS Code) |
| `Pancho: Comment block` | Toggle block comment (delegates to VS Code) |

## Developers
| Command | Description |
|---------|-------------|
| `Pancho: Duplicate line` | Duplicate current line |
| `Pancho: Insert line before` | Insert empty line before |
| `Pancho: Insert line after` | Insert empty line after |
| `Pancho: Move line up` | Move line up |
| `Pancho: Move line down` | Move line down |
| `Pancho: Delete lines containing...` | Delete lines by content |
| `Pancho: Keep only lines containing...` | Keep lines by content |
| `Pancho: Transpose characters` | Swap last two chars |
| `Pancho: Transpose words` | Swap last two words |
| `Pancho: Transpose lines` | Swap last two lines |
| `Pancho: Align by =` | Align by equals |
| `Pancho: Align by :` | Align by colon |
| `Pancho: Align by character...` | Align by custom char |

## Columns
| Command | Description |
|---------|-------------|
| `Pancho: Column: insert text...` | Insert text at the column block |
| `Pancho: Column: delete` | Delete the column block |
| `Pancho: Column: copy` | Copy the column block |
| `Pancho: Column: paste` | Paste into the column block |
| `Pancho: Column: fill series...` | Fill the column with an incrementing series |

## Macros
| Command | Description |
|---------|-------------|
| `Pancho: Macro: start recording` | Start recording a macro |
| `Pancho: Macro: stop recording` | Stop and keep the macro |
| `Pancho: Macro: play` | Replay the last macro |
| `Pancho: Macro: save...` | Save the last macro |
| `Pancho: Macro: load...` | Load a saved macro |
| `Pancho: Macro: list saved` | List saved macros |
| `Pancho: Macro: export...` | Export saved macros to a JSON file |
| `Pancho: Macro: import...` | Import macros from a JSON file |

## Escape
| Command | Description |
|---------|-------------|
| `Pancho: Escape for JSON` | Escape for JSON |
| `Pancho: Unescape from JSON` | Unescape from JSON |
| `Pancho: Escape for SQL` | Escape for SQL |
| `Pancho: Unescape from SQL` | Unescape from SQL |
| `Pancho: Escape for regex` | Escape for regex |
| `Pancho: Escape for HTML` | Escape for HTML |
| `Pancho: Unescape from HTML` | Unescape from HTML |

## Developer Tools
| Command | Description |
|---------|-------------|
| `Pancho: Decode JWT` | Decode JWT token |
| `Pancho: Timestamp to ISO` | Unix timestamp → ISO |
| `Pancho: ISO to timestamp` | ISO → Unix timestamp |
| `Pancho: Insert current timestamp` | Insert current timestamp |
| `Pancho: AES encrypt...` | AES-256-GCM encrypt |
| `Pancho: AES decrypt...` | AES-256-GCM decrypt |
| `Pancho: Color info` | Show HEX + RGB + HSL |
| `Pancho: Regex tester...` | Quick regex test from an input box |
| `Pancho: Regex tester panel` | Full panel with live matches, groups and replace preview |

## Command hub
| Command | Description |
|---------|-------------|
| `Pancho: Show command menu` | Quick Pick hub of all categories and commands (with recently used on top) |
| `Pancho: Repeat last command` | Re-run the previous Pancho command |
| `Pancho: Repeat last command N times...` | Re-run the previous command N times |
