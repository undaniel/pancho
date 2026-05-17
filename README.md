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
3. [Caso](#caso)
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

## 3. Caso
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

1. Agregar comando en `package.json` y submenú correspondiente

2. Crear función de transformación en `src/transforms/*.ts`

3. Agregar constante en `src/commands/registry.ts`

4. Registrar en `src/commands/index.ts`

5. Compilar con `npm run compile`

6. Probar con **F5** (Extension Development Host)

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