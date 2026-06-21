# Pancho - VS Code Extension

<div align="center">
  <img src="pancho.webp" alt="Pancho" width="200"/>
  <p>
    <strong>Extensión para limpiar y formatear texto como Notepad++</strong>
  </p>
  <p>
    <img src="https://img.shields.io/badge/VSCode-^1.80.0-blue" alt="vscode"/>
    <img src="https://img.shields.io/badge/TypeScript-^5.0.0-blue" alt="typescript"/>
  </p>
</div>

---

## Menú Pancho

> Lista de comandos disponible en el menú contextual

1. [Edición](#edici-n)
2. [Líneas](#l-neas)
3. [Mayúsculas y minúsculas](#mayúsculas-y-minúsculas)
4. [Tabulaciones](#tabulaciones)
5. [Fin de línea](#fin-de-l-nea)
6. [Texto general](#texto-general)
7. [Codificación](#codificaci-n)
8. [Formateo](#formateo)
9. [Hash y binario](#hash-y-binario)
10. [Insertar](#insertar)
11. [Comentar / Descomentar](#comentar-descomentar)
12. [Desarrolladores](#desarrolladores)
13. [Escapar](#escapar)


---

## 1. Edición
<details>
<summary>Ver comandos</summary>

| Comando | Función |
|---------|----------|
| `pancho.cleanWhitespace` | Limpiar espacios en blanco |
| `pancho.cleanLineEndings` | Limpiar saltos de línea |
| `pancho.trimLines` | Recortar líneas |
| `pancho.lineEndingsToSpaces` | Convertir saltos de línea a espacios |

</details>

---

## 2. Líneas
<details>
<summary>Ver comandos</summary>

| Comando | Función |
|---------|----------|
| `pancho.removeDuplicateLines` | Eliminar líneas duplicadas |
| `pancho.sortAscending` | Ordenar A-Z |
| `pancho.sortDescending` | Ordenar Z-A |
| `pancho.reverseLines` | Revertir líneas |
| `pancho.joinLines` | Unir líneas |
| `pancho.removeEmptyLines` | Eliminar líneas vacías |

</details>

---

## 3. Mayúsculas y minúsculas
<details>
<summary>Ver comandos</summary>

| Comando | Función |
|---------|----------|
| `pancho.toUpperCase` | Convertir a MAYÚSCULAS |
| `pancho.toLowerCase` | Convertir a minúsculas |
| `pancho.toTitleCase` | Convertir a Título |

</details>

---

## 4. Tabulaciones
<details>
<summary>Ver comandos</summary>

| Comando | Función |
|---------|----------|
| `pancho.convertTabsToSpaces` | Convertir tabs a espacios |
| `pancho.convertSpacesToTabs` | Convertir espacios a tabs |
| `pancho.increaseIndent` | Aumentar indentación |
| `pancho.decreaseIndent` | Disminuir indentación |

</details>

---

## 5. Fin de línea
<details>
<summary>Ver comandos</summary>

| Comando | Función |
|---------|----------|
| `pancho.toWindowsEOL` | Convertir a Windows (CRLF) |
| `pancho.toUnixEOL` | Convertir a Unix (LF) |
| `pancho.toMacEOL` | Convertir a Mac (CR) |

</details>

---

## 6. Texto general
<details>
<summary>Ver comandos</summary>

| Comando | Función |
|---------|----------|
| `pancho.countWords` | Contar palabras |
| `pancho.countCharacters` | Contar caracteres |
| `pancho.countLines` | Contar líneas |
| `pancho.removeDuplicateWords` | Eliminar palabras duplicadas |
| `pancho.numberLines` | Numerar líneas |
| `pancho.removeLineNumbers` | Quitar números de línea |
| `pancho.slugify` | Generar slug URL |
| `pancho.reverseWords` | Revertir palabras |
| `pancho.randomizeLines` | Aleatorizar líneas |
| `pancho.pasteWithoutLineBreak` | Pegar sin salto de línea |
| `pancho.copyToMultipleLines` | Copiar a múltiples líneas |
| `pancho.formatAsCSV` | Formatear como CSV |

</details>

---

## 7. Codificación
<details>
<summary>Ver comandos</summary>

| Comando | Función |
|---------|----------|
| `pancho.base64Encode` | Codificar Base64 |
| `pancho.base64Decode` | Decodificar Base64 |
| `pancho.urlEncode` | Codificar URL |
| `pancho.urlDecode` | Decodificar URL |
| `pancho.htmlEntitiesEncode` | Codificar HTML entities |
| `pancho.htmlEntitiesDecode` | Decodificar HTML entities |

</details>

---

## 8. Formateo
<details>
<summary>Ver comandos</summary>

| Comando | Función |
|---------|----------|
| `pancho.minifyJSON` | Minificar JSON |
| `pancho.prettifyJSON` | Formatear JSON |
| `pancho.minifyHTML` | Minificar HTML |
| `pancho.prettifyHTML` | Formatear HTML |
| `pancho.minifyCSS` | Minificar CSS |
| `pancho.prettifyCSS` | Formatear CSS |
| `pancho.minifyJS` | Minificar JavaScript |
| `pancho.prettifyJS` | Formatear JavaScript |
| `pancho.formatSQL` | Formatear SQL |
| `pancho.prettifyXML` | Formatear XML |
| `pancho.minifyXML` | Minificar XML |

</details>

---

## 9. Hash y binario
<details>
<summary>Ver comandos</summary>

| Comando | Función |
|---------|----------|
| `pancho.hashMD5` | Hash MD5 |
| `pancho.hashSHA256` | Hash SHA-256 |
| `pancho.toBinary` | Texto a binario |
| `pancho.fromBinary` | Binario a texto |
| `pancho.toHex` | Texto a hexadecimal |
| `pancho.fromHex` | Hexadecimal a texto |
| `pancho.hexToRgb` | Hex a RGB |
| `pancho.rgbToHex` | RGB a Hex |
| `pancho.generateUUID` | Generar UUID |
| `pancho.generateRandomString` | Generar cadena aleatoria |

</details>

---

## 10. Insertar
<details>
<summary>Ver comandos</summary>

| Comando | Función |
|---------|----------|
| `pancho.insertShortTime` | Fecha y hora corta |
| `pancho.insertLongTime` | Fecha y hora larga |
| `pancho.insertDateTime` | Fecha y hora (dd-MM-yyyy hh:mm:ss) |
| `pancho.loremIpsum` | Generar Lorem Ipsum |

</details>

---

## 11. Comentar / Descomentar
<details>
<summary>Ver comandos</summary>

| Comando | Función |
|---------|----------|
| `pancho.commentLine` | Comentar línea |
| `pancho.uncommentLine` | Descomentar línea |
| `pancho.commentBlock` | Comentar bloque |
| `pancho.uncommentBlock` | Descomentar bloque |

</details>

---

## 12. Desarrolladores
<details>
<summary>Ver comandos</summary>

| Comando | Función |
|---------|----------|
| `pancho.duplicateLine` | Duplicar línea |
| `pancho.insertLineBefore` | Insertar línea antes |
| `pancho.insertLineAfter` | Insertar línea después |
| `pancho.deleteLinesContaining` | Eliminar líneas con... |
| `pancho.keepOnlyLinesContaining` | Mantener solo líneas con... |
| `pancho.highlightMatches` | Resaltar coincidencias |
| `pancho.countMatches` | Contar coincidencias |

</details>

---

## 13. Escapar
<details>
<summary>Ver comandos</summary>

| Comando | Función |
|---------|----------|
| `pancho.escapeJSON` | Escapar para JSON |
| `pancho.unescapeJSON` | Desescapar de JSON |
| `pancho.escapeForSQL` | Escapar para SQL |
| `pancho.unescapeForSQL` | Desescapar de SQL |
| `pancho.escapeForRegex` | Escapar para Regex |
| `pancho.escapeForHTML` | Escapar para HTML |
| `pancho.unescapeForHTML` | Desescapar de HTML |

</details>

---



---

## Estructura del proyecto

```
pancho/
├── src/
│   ├── commands/
│   │   ├── index.ts      # Registro de comandos
│   │   ├── factory.ts    # Factory para comandos
│   │   └── registry.ts  # Constantes centralizadas
│   ├── transforms/       # Funciones de transformación
│   │   ├── case.ts
│   │   ├── comments.ts
│   │   ├── dateTime.ts
│   │   ├── eol.ts
│   │   ├── lines.ts
│   │   ├── lineEndings.ts
│   │   ├── lineUtils.ts
│   │   ├── spaces.ts
│   │   ├── specialPaste.ts
│   │   ├── tabs.ts
│   │   ├── textGeneral/
│   │   ├── webDev/
│   │   └── whitespace.ts
│   ├── utils/
│   │   ├── editor.ts     # Utilidades de editor
│   │   └── textAnalyzer.ts
│   └── extension.ts      # Entry point
├── dist/                  # Archivos compilados (no editar)
├── package.json          # Configuración de la extensión
├── tsconfig.json         # Configuración TypeScript
├── scripts/
│   ├── generate-readme.js
│   └── templates/
│       └── README.md
└── .vscode/
    └── launch.json       # Configuración para depuración (F5)
```

---

## Para agregar un nuevo comando

### Paso 1: Crear la función de transformación

Crea o modifica un archivo en `src/transforms/`. La función debe seguir uno de estos formatos:

```typescript
// Formato simple (sin manejo de errores)
export function myTransform(text: string): string {
    return text.toUpperCase();
}

// Formato con manejo de errores
export function myTransform(text: string): { result: string; error?: string } {
    try {
        return { result: someOperation(text) };
    } catch {
        return { result: text, error: 'Mensaje de error' };
    }
}

// Formato con warnings de seguridad
export function myTransform(text: string): { result: string; warning?: string } {
    return { result: text, warning: 'Advertencia de seguridad' };
}
```

### Paso 2: Registrar el comando

Agrega la constante en `src/commands/registry.ts`:

```typescript
export const Commands = {
    // ... comandos existentes ...
    MY_COMMAND: 'pancho.myCommand',
} as const;
```

### Paso 3: Registrar en index.ts

Usa `registerTextCommand` para comandos de transformación:

```typescript
import { myTransform } from '../transforms/myFile';

registerTextCommand(context, {
    command: Commands.MY_COMMAND,
    transform: (text) => myTransform(text),
});
```

Para comandos que requieren el índice de línea actual (como mover líneas), usa `registerLineCommand`:

```typescript
registerLineCommand(context, {
    command: Commands.MY_LINE_COMMAND,
    transform: (text, lineIndex) => myLineTransform(text, lineIndex),
});
```

### Paso 4: Agregar al package.json

1. En la sección `commands`, agrega el comando:

```json
{
    "command": "pancho.myCommand",
    "title": "Mi Comando"
}
```

2. En la sección `menus`, agrega el comando al submenú correspondiente:

```json
"panchoMiSubmenu": [
    {
        "command": "pancho.myCommand"
    }
]
```

### Paso 5: Compilar y probar

```bash
npm run compile
# Presiona F5 para abrir Extension Development Host
```

---

## Compilar y generar la extensión

### Desarrollo local

```bash
# Compilar TypeScript
npm run compile

# Abrir en VS Code para probar
code .
# Presiona F5 para iniciar el Extension Development Host
```

### Generar paquete .vsix para distribución

```bash
# Instalar vsce globally si no lo tienes
npm install -g vsce

# Generar archivo .vsix
vsce package

# El archivo pancho-x.x.x.vsix se generará en el directorio raíz
```

### Instalar localmente

```bash
# Usando vsix
code --install-extension pancho-x.x.x.vsix

# Desinstalar
code --uninstall-extension pancho
```

### Usar en otra máquina

1. Copia el archivo `.vsix` a la máquina destino
2. Ejecuta `code --install-extension pancho-x.x.x.vsix`
3. O arrastra el archivo al área de extensiones de VS Code

---

## Testing

```bash
# Ejecutar todos los tests
npm run test

# Tests en modo watch
npm run test:watch

# Coverage report
npm run test:coverage
```

Los tests están en `tests/*.test.ts`. Verifica que pasan antes de.commit.

---

## Configuración

La extensión provee opciones configurables en `package.json`:

- `pancho.tabSize`: Tamaño de tabulación (default: 4)
- `pancho.indentWithSpaces`: Usar espacios en vez de tabs (default: true)
- `pancho.defaultEOL`: Fin de línea por defecto (default: LF)
- `pancho.statusBarShowCounters`: Mostrar contadores en barra de estado
- `pancho.maxFileSizeKB`: Tamaño máximo de archivo para procesar
- `pancho.loremIpsumWordCount`: Palabras en Lorem Ipsum
- `pancho.randomStringLength`: Longitud de strings aleatorios

---

## Publicar en Marketplace

### Requisitos
- Cuenta de publisher en [Visual Studio Marketplace](https://marketplace.visualstudio.com/)
- [vsce](https://github.com/microsoft/vscode-vsce) instalado globalmente

### Preparar assets para marketplace

1. **Icono**: 256x256 PNG (ya existe en `images/icon.png`)
2. **Banner**: 1280x640 JPG para el header (crear como `images/store-header.jpg`)
3. **Screenshots**: GIF animados en `images/screenshots/` folder

### Publicar

```bash
# Generar archivo .vsix
npm run package

# Publicar (requiere token de publisher)
npm run publish

# O manualmente:
vsce package
vsce publish
```

### Changelog

El archivo `CHANGELOG.md` documenta todos los cambios. Actualizarlo antes de cada release.

---

## Arquitectura

---

## Instalación

Se puede empaquetar la extensión en un archivo `.vsix` e instalarla manualmente sin publicar en el Marketplace.

### Empaquetar

```bash
npm install -g vsce
vsce package
```

Esto genera un archivo `pancho-x.x.x.vsix`.

### Instalar

```bash
code --install-extension pancho-x.x.x.vsix
```

### Desinstalar

```bash
code --uninstall-extension pancho
```

---

## Debugging

- Los logs aparecen en el **Debug Console** de VS Code
- Mensajes de error aparecen como notificaciones
- Para recargar: **F5** o **Developer: Reload Window**

---

<div align="center">
  <p>Hecho con ❤️ para panchos</p>
</div>