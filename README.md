# Pancho

[![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](https://github.com/undaniel/pancho)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![VSCode Engine](https://img.shields.io/badge/VSCode-%5E1.80.0-blue.svg)](https://code.visualstudio.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-%5E5.0.0-blue.svg)](https://www.typescriptlang.org/)

> Clean, format and transform text like Notepad++

**Language:** [English](#english) · [Español](#español)

---

## English

### Features

- **124 commands** available from the context menu
- **Status bar counters** (lines, words, characters)
- **Keyboard shortcuts** for frequent operations
- **Settings** for tab size, EOL and more
- **English & Spanish** UI (follows VS Code's display language)

### How to use

1. Select text (or don't, to apply to the whole document)
2. Right-click → **Pancho**
3. Pick a category and a command

### Commands

#### Editing
| Command | Description |
|---------|-------------|
| `Pancho: Clean whitespace` | Remove multiple spaces |
| `Pancho: Clean line endings` | Normalize line endings |
| `Pancho: Trim lines` | Trim leading/trailing whitespace |
| `Pancho: Convert line endings to spaces` | Line breaks → spaces |
| `Pancho: Wrap text...` | Wrap at column width |
| `Pancho: Unwrap text` | Remove line breaks |

#### Lines
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
| `Pancho: Reverse lines` | Reverse order |
| `Pancho: Randomize lines` | Shuffle lines |
| `Pancho: Join lines` | Join into a single line |
| `Pancho: Remove empty lines` | Remove blank lines |

#### Case
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

#### Indentation
| Command | Description |
|---------|-------------|
| `Pancho: Convert tabs to spaces` | Tabs → spaces |
| `Pancho: Convert spaces to tabs` | Spaces → tabs |
| `Pancho: Increase indent` | Increase indent |
| `Pancho: Decrease indent` | Decrease indent |

#### End of line
| Command | Description |
|---------|-------------|
| `Pancho: Convert to Windows (CRLF)` | Windows format |
| `Pancho: Convert to Unix (LF)` | Unix/Mac format |
| `Pancho: Convert to Mac (CR)` | Classic Mac format |

#### General text
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
| `Pancho: Format as CSV` | Format as CSV |
| `Pancho: Remove diacritics` | Remove accents |
| `Pancho: Strip HTML tags` | Strip HTML tags |
| `Pancho: CSV to JSON` | CSV → JSON |
| `Pancho: JSON to CSV` | JSON → CSV |
| `Pancho: CSV to TSV` | CSV → TSV |
| `Pancho: TSV to CSV` | TSV → CSV |
| `Pancho: CSV to Markdown table` | CSV → Markdown table |
| `Pancho: Markdown table to CSV` | Markdown table → CSV |

#### Encoding
| Command | Description |
|---------|-------------|
| `Pancho: Base64 encode` | Encode to Base64 |
| `Pancho: Base64 decode` | Decode from Base64 |
| `Pancho: URL encode` | URL-encode |
| `Pancho: URL decode` | URL-decode |
| `Pancho: HTML entities encode` | Escape HTML characters |
| `Pancho: HTML entities decode` | Unescape HTML |

#### Formatting
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

#### Hash & binary
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

#### Insert
| Command | Description |
|---------|-------------|
| `Pancho: Short date/time` | Short date/time |
| `Pancho: Long date/time` | Long date/time |
| `Pancho: Date/time (dd-MM-yyyy hh:mm:ss)` | Custom date/time |
| `Pancho: Generate Lorem Ipsum` | Lorem Ipsum filler |
| `Pancho: Generate UUID` | UUID v4 |
| `Pancho: Generate random string` | Random string |

#### Comment / Uncomment
| Command | Description |
|---------|-------------|
| `Pancho: Comment line` | Comment line |
| `Pancho: Uncomment line` | Uncomment line |
| `Pancho: Comment block` | Comment block |
| `Pancho: Uncomment block` | Uncomment block |

#### Developers
| Command | Description |
|---------|-------------|
| `Pancho: Duplicate line` | Duplicate current line |
| `Pancho: Insert line before` | Insert empty line before |
| `Pancho: Insert line after` | Insert empty line after |
| `Pancho: Move line up` | Move line up |
| `Pancho: Move line down` | Move line down |
| `Pancho: Delete lines containing...` | Delete lines by content |
| `Pancho: Keep only lines containing...` | Keep lines by content |
| `Pancho: Highlight matches` | Highlight matches |
| `Pancho: Count matches` | Count occurrences |
| `Pancho: Transpose characters` | Swap last two chars |
| `Pancho: Transpose words` | Swap last two words |
| `Pancho: Transpose lines` | Swap last two lines |
| `Pancho: Align by =` | Align by equals |
| `Pancho: Align by :` | Align by colon |
| `Pancho: Align by character...` | Align by custom char |

#### Escape
| Command | Description |
|---------|-------------|
| `Pancho: Escape for JSON` | Escape for JSON |
| `Pancho: Unescape from JSON` | Unescape from JSON |
| `Pancho: Escape for SQL` | Escape for SQL |
| `Pancho: Unescape from SQL` | Unescape from SQL |
| `Pancho: Escape for regex` | Escape for regex |
| `Pancho: Escape for HTML` | Escape for HTML |
| `Pancho: Unescape from HTML` | Unescape from HTML |

#### Search
| Command | Description |
|---------|-------------|
| `Pancho: Search in workspace files...` | Search across all files |
| `Pancho: Replace in workspace files...` | Replace across all files |

#### Developer Tools
| Command | Description |
|---------|-------------|
| `Pancho: Decode JWT` | Decode JWT token |
| `Pancho: Timestamp to ISO` | Unix timestamp → ISO |
| `Pancho: ISO to timestamp` | ISO → Unix timestamp |
| `Pancho: Insert current timestamp` | Insert current timestamp |
| `Pancho: AES encrypt...` | AES-256-CBC encrypt |
| `Pancho: AES decrypt...` | AES-256-CBC decrypt |
| `Pancho: Color info` | Show HEX + RGB + HSL |
| `Pancho: Regex tester...` | Test regex with groups |

### Keyboard shortcuts

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

> Mac shortcuts use `Cmd+Alt+...` to avoid clashing with native VS Code shortcuts (`Cmd+Shift+W` closes the window, etc.).

### Settings

| Option | Default | Description |
|--------|---------|-------------|
| `pancho.tabSize` | `4` | Tab size |
| `pancho.defaultEOL` | `LF` | Default end of line |
| `pancho.statusBarShowCounters` | `true` | Show counters |
| `pancho.maxFileSizeKB` | `5120` | Max file size to process |
| `pancho.loremIpsumWordCount` | `50` | Lorem Ipsum word count |
| `pancho.randomStringLength` | `16` | Random string length |

### Status bar counters

Pancho shows `L:X P:Y C:Z` (Lines, Words, Characters) in the status bar. Updates as you select text.

---

## Español

### Características

- **124 comandos** accesibles desde el menú contextual
- **Contadores en barra de estado** (líneas, palabras, caracteres)
- **Atajos de teclado** para operaciones frecuentes
- **Configuración** de tabulación, EOL y más
- **Interfaz en inglés y español** (sigue el idioma de VS Code)

### Cómo usar

1. Selecciona texto (o no, para aplicar a todo el documento)
2. Clic derecho → **Pancho**
3. Elige la categoría y el comando

### Comandos

#### Edición
| Comando | Descripción |
|---------|-------------|
| `Pancho: Limpiar espacios en blanco` | Elimina espacios múltiples |
| `Pancho: Limpiar saltos de línea` | Normaliza saltos de línea |
| `Pancho: Recortar líneas` | Elimina espacios al inicio/final |
| `Pancho: Convertir saltos de línea a espacios` | Convierte saltos a espacios |
| `Pancho: Ajustar texto...` | Ajusta a ancho de columna |
| `Pancho: Desajustar texto` | Quita saltos de línea |

#### Líneas
| Comando | Descripción |
|---------|-------------|
| `Pancho: Eliminar líneas duplicadas` | Quita todos los duplicados |
| `Pancho: Eliminar líneas duplicadas consecutivas` | Quita solo adyacentes |
| `Pancho: Ordenar A-Z` | Ordena ascendentemente |
| `Pancho: Ordenar Z-A` | Ordena descendentemente |
| `Pancho: Ordenar natural` | Orden natural (`file2` < `file10`) |
| `Pancho: Ordenar natural descendente` | Orden natural inverso |
| `Pancho: Ordenar por longitud` | Más cortas primero |
| `Pancho: Ordenar por longitud descendente` | Más largas primero |
| `Pancho: Ordenar numérico` | Numérico ascendente |
| `Pancho: Revertir líneas` | Invierte el orden |
| `Pancho: Aleatorizar líneas` | Mezcla aleatoriamente |
| `Pancho: Unir líneas` | Combina líneas en una |
| `Pancho: Eliminar líneas vacías` | Quita líneas en blanco |

#### Mayúsculas y minúsculas
| Comando | Descripción |
|---------|-------------|
| `Pancho: Convertir a MAYÚSCULAS` | TODO EN MAYÚSCULAS |
| `Pancho: Convertir a minúsculas` | todo en minúsculas |
| `Pancho: Convertir a Título` | Cada Palabra Capitalizada |
| `Pancho: Convertir a sentence case` | Sentence case |
| `Pancho: Invertir mayúsculas/minúsculas` | Intercambia may/min |
| `Pancho: Mayúsculas aleatorias` | May/min aleatorio |
| `Pancho: Convertir a camelCase` | camelCase |
| `Pancho: Convertir a PascalCase` | PascalCase |
| `Pancho: Convertir a snake_case` | snake_case |
| `Pancho: Convertir a kebab-case` | kebab-case |
| `Pancho: Convertir a CONSTANT_CASE` | CONSTANT_CASE |

#### Tabulaciones
| Comando | Descripción |
|---------|-------------|
| `Pancho: Convertir tabs a espacios` | Reemplaza tabs |
| `Pancho: Convertir espacios a tabs` | Reemplaza espacios |
| `Pancho: Aumentar indentación` | Agrega indentación |
| `Pancho: Disminuir indentación` | Quita indentación |

#### Fin de línea
| Comando | Descripción |
|---------|-------------|
| `Pancho: Convertir a Windows (CRLF)` | Formato Windows |
| `Pancho: Convertir a Unix (LF)` | Formato Unix/Mac |
| `Pancho: Convertir a Mac (CR)` | Formato Mac clásico |

#### Texto general
| Comando | Descripción |
|---------|-------------|
| `Pancho: Contar palabras` | Cuenta palabras |
| `Pancho: Contar caracteres` | Cuenta caracteres |
| `Pancho: Contar líneas` | Cuenta líneas |
| `Pancho: Eliminar palabras duplicadas` | Elimina palabras duplicadas |
| `Pancho: Numerar líneas` | Agrega números de línea |
| `Pancho: Quitar números de línea` | Elimina números de línea |
| `Pancho: Generar slug URL` | Genera slug para URL |
| `Pancho: Revertir palabras` | Invierte orden de palabras |
| `Pancho: Aleatorizar líneas` | Mezcla aleatoriamente |
| `Pancho: Pegar sin salto de línea` | Pega sin saltos |
| `Pancho: Copiar a múltiples líneas` | Copia a múltiples líneas |
| `Pancho: Formatear como CSV` | Formatea como CSV |
| `Pancho: Quitar acentos y diacríticos` | Quita acentos |
| `Pancho: Quitar etiquetas HTML` | Quita etiquetas HTML |
| `Pancho: CSV a JSON` | CSV → JSON |
| `Pancho: JSON a CSV` | JSON → CSV |
| `Pancho: CSV a TSV` | CSV → TSV |
| `Pancho: TSV a CSV` | TSV → CSV |
| `Pancho: CSV a tabla Markdown` | CSV → tabla Markdown |
| `Pancho: Tabla Markdown a CSV` | Tabla Markdown → CSV |

#### Codificación
| Comando | Descripción |
|---------|-------------|
| `Pancho: Codificar Base64` | Codifica a Base64 |
| `Pancho: Decodificar Base64` | Decodifica Base64 |
| `Pancho: Codificar URL` | Codifica para URLs |
| `Pancho: Decodificar URL` | Decodifica URLs |
| `Pancho: Codificar HTML entities` | Escapa caracteres HTML |
| `Pancho: Decodificar HTML entities` | Desescapa HTML |

#### Formateo
| Comando | Descripción |
|---------|-------------|
| `Pancho: Minificar JSON` | JSON en una línea |
| `Pancho: Formatear JSON` | JSON con indentación |
| `Pancho: Minificar HTML` | HTML comprimido |
| `Pancho: Formatear HTML` | HTML con indentación |
| `Pancho: Minificar CSS` | CSS comprimido |
| `Pancho: Formatear CSS` | CSS con indentación |
| `Pancho: Minificar JavaScript` | JS comprimido |
| `Pancho: Formatear JavaScript` | JS con indentación |
| `Pancho: Formatear SQL` | SQL con formato |
| `Pancho: Formatear XML` | XML con indentación |
| `Pancho: Minificar XML` | XML comprimido |

#### Hash y binario
| Comando | Descripción |
|---------|-------------|
| `Pancho: Hash MD5` | Genera hash MD5 |
| `Pancho: Hash SHA-256` | Genera hash SHA-256 |
| `Pancho: Texto a binario` | Convierte a binario |
| `Pancho: Binario a texto` | Convierte de binario |
| `Pancho: Texto a hexadecimal` | Convierte a hexadecimal |
| `Pancho: Hexadecimal a texto` | Convierte de hexadecimal |
| `Pancho: Hex a RGB` | Convierte color hex a RGB |
| `Pancho: RGB a Hex` | Convierte RGB a hex |

#### Insertar
| Comando | Descripción |
|---------|-------------|
| `Pancho: Fecha y hora corta` | Inserta fecha/hora corta |
| `Pancho: Fecha y hora larga` | Inserta fecha/hora larga |
| `Pancho: Fecha y hora (dd-MM-yyyy hh:mm:ss)` | Fecha/hora personalizada |
| `Pancho: Generar Lorem Ipsum` | Genera texto dummy |
| `Pancho: Generar UUID` | Genera UUID v4 |
| `Pancho: Generar cadena aleatoria` | Genera string aleatorio |

#### Comentar / Descomentar
| Comando | Descripción |
|---------|-------------|
| `Pancho: Comentar línea` | Agrega comentario |
| `Pancho: Descomentar línea` | Quita comentario |
| `Pancho: Comentar bloque` | Comenta selección |
| `Pancho: Descomentar bloque` | Descomenta selección |

#### Desarrolladores
| Comando | Descripción |
|---------|-------------|
| `Pancho: Duplicar línea` | Duplica línea actual |
| `Pancho: Insertar línea antes` | Inserta línea vacía antes |
| `Pancho: Insertar línea después` | Inserta línea vacía después |
| `Pancho: Mover línea arriba` | Sube línea |
| `Pancho: Mover línea abajo` | Baja línea |
| `Pancho: Eliminar líneas con...` | Elimina líneas por contenido |
| `Pancho: Mantener solo líneas con...` | Mantiene líneas por contenido |
| `Pancho: Resaltar coincidencias` | Resalta coincidencias |
| `Pancho: Contar coincidencias` | Cuenta ocurrencias |
| `Pancho: Transponer caracteres` | Intercambia últimos 2 chars |
| `Pancho: Transponer palabras` | Intercambia últimas 2 palabras |
| `Pancho: Transponer líneas` | Intercambia últimas 2 líneas |
| `Pancho: Alinear por =` | Alinea por igual |
| `Pancho: Alinear por :` | Alinea por dos puntos |
| `Pancho: Alinear por carácter...` | Alinea por carácter custom |

#### Escapar
| Comando | Descripción |
|---------|-------------|
| `Pancho: Escapar para JSON` | Escapa caracteres JSON |
| `Pancho: Desescapar de JSON` | Desescapa de JSON |
| `Pancho: Escapar para SQL` | Escapa comillas SQL |
| `Pancho: Desescapar de SQL` | Desescapa de SQL |
| `Pancho: Escapar para Regex` | Escapa caracteres regex |
| `Pancho: Escapar para HTML` | Escapa caracteres HTML |
| `Pancho: Desescapar de HTML` | Desescapa de HTML |

#### Buscar
| Comando | Descripción |
|---------|-------------|
| `Pancho: Buscar en archivos del workspace...` | Busca en todos los archivos |
| `Pancho: Reemplazar en archivos del workspace...` | Reemplaza en todos los archivos |

#### Herramientas de desarrollo
| Comando | Descripción |
|---------|-------------|
| `Pancho: Decodificar JWT` | Decodifica token JWT |
| `Pancho: Timestamp a ISO` | Timestamp Unix → ISO |
| `Pancho: ISO a timestamp` | ISO → Timestamp Unix |
| `Pancho: Insertar timestamp actual` | Inserta timestamp actual |
| `Pancho: Cifrar con AES...` | Cifra AES-256-CBC |
| `Pancho: Descifrar con AES...` | Descifra AES-256-CBC |
| `Pancho: Información de color` | Muestra HEX + RGB + HSL |
| `Pancho: Probador de regex...` | Prueba regex con grupos |

### Atajos de teclado

| Atajo (Win/Linux) | Atajo (Mac) | Comando |
|-------|-------|---------|
| `Ctrl+Shift+U` | `Cmd+Shift+U` | Mayúsculas |
| `Ctrl+Shift+L` | `Cmd+Alt+L` | Minúsculas |
| `Ctrl+Shift+T` | `Cmd+Alt+T` | Recortar líneas |
| `Ctrl+Shift+W` | `Cmd+Alt+W` | Contar palabras |
| `Ctrl+Shift+C` | `Cmd+Alt+C` | Contar caracteres |
| `Ctrl+Shift+N` | `Cmd+Alt+N` | Contar líneas |
| `Ctrl+Shift+S` | `Cmd+Alt+S` | Ordenar A-Z |
| `Ctrl+Shift+D` | `Cmd+Alt+D` | Eliminar duplicados |

> Los atajos en Mac usan `Cmd+Alt+...` para evitar chocar con los nativos de VS Code (`Cmd+Shift+W` cierra ventana, etc.).

### Configuración

| Opción | Default | Descripción |
|--------|---------|-------------|
| `pancho.tabSize` | `4` | Tamaño de tabulación |
| `pancho.defaultEOL` | `LF` | Fin de línea por defecto |
| `pancho.statusBarShowCounters` | `true` | Mostrar contadores |
| `pancho.maxFileSizeKB` | `5120` | Tamaño máximo de archivo |
| `pancho.loremIpsumWordCount` | `50` | Palabras en Lorem Ipsum |
| `pancho.randomStringLength` | `16` | Longitud de string aleatorio |

### Contadores en barra de estado

Pancho muestra `L:X P:Y C:Z` (Líneas, Palabras, Caracteres) en la barra de estado. Se actualiza al seleccionar texto.

---

**¿Te gusta Pancho? / Do you like Pancho?** Deja una reseña en el Marketplace · Leave a review on the Marketplace.
