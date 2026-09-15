# Pancho demos

Practical examples for the most useful Pancho features. Everything runs locally —
no text ever leaves your machine.

## Hover info

Hover any of these and Pancho shows the decoded value inline:

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U
1700000000
#1e88e5
aGVsbG8gd29ybGQgdGhpcyBpcyBhIHRlc3Q=
```

- **JWT** → header + payload (with `exp` resolved to a date).
- **Timestamp** → ISO and locale date (`10` digits = seconds, `13` = milliseconds).
- **Color** → HEX, RGB and HSL.
- **Base64** → the decoded text, when it is printable.

## Quick fixes (Code Actions)

Select a value and press `Ctrl+.` to get contextual conversions:

| Selection | Offered actions |
|-----------|-----------------|
| JWT | Decode JWT |
| JSON object | Prettify / Minify JSON, JSON to CSV |
| CSV / TSV | CSV to JSON, CSV to Markdown table |
| `#rrggbb` or `rgb(...)` | Show color info, Hex to RGB |
| Base64 | Decode Base64 |
| Unix timestamp | Timestamp to ISO |

## Regex tester panel

Run **Pancho: Regex tester panel** (`Ctrl+Alt+R`):

1. Type a pattern and flags (`gimsuy`); matches update live and are highlighted.
2. Capture groups are listed per match.
3. Fill **Replace with**, press **Preview** to see the result, then **Apply to document**
   (applies to the selection, or the whole document when there is no selection).

The matching runs in the same time-limited worker as the rest of Pancho, so an
accidental catastrophic pattern cannot freeze the editor.

## Column mode

1. `Alt`+drag (or `Ctrl`+`Alt`+`Down`) to create a column selection.
2. Open **Pancho → Developers**:
   - **Column: insert text...** — insert the same text on every line.
   - **Column: fill series...** — number the lines (start value + step).
   - **Column: copy / delete / paste** — move blocks of columns around.

## Clipboard history

Copy a few things, then run **Pancho: Clipboard history** (`Ctrl+Alt+V`) and pick
an entry to paste at the cursor. Configure it with `pancho.clipboardHistoryEnabled`
and `pancho.clipboardHistorySize`.

## Sorting tables

**Pancho: Sort by column...** asks for the delimiter, the zero-based column index
and whether the sort is numeric:

```csv
name,age
luis,30
ana,25
```

Delimiter `,`, column `1`, numeric `y` → the row for `ana` moves on top (the header
stays first when it is included as a data row, so feed it as row 0 or keep it out).

## Macros

1. **Macro: start recording**, perform a few Pancho commands, **Macro: stop recording**.
2. **Macro: play** replays them; **Macro: save...** stores it, **Macro: export...**
   writes all saved macros to a JSON file you can share or commit.

## Chaining

Use **Repeat last command** (`Ctrl+Shift+.`) or **Repeat last command N times...**
to apply the previous operation repeatedly — handy after *Remove duplicate lines* or
*Sort by column*.
