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

1. [Operaciones de limpieza](#operaciones-de-limpieza)
2. [Líneas](#l-neas)
3. [Fin de línea](#fin-de-l-nea)
4. [Tabulaciones](#tabulaciones)
5. [Insertar](#insertar)
6. [Comentar / Descomentar](#comentar-descomentar)
7. [Pegado especial](#pegado-especial)
8. [Caracteres especiales](#caracteres-especiales)
9. [Texto general](#texto-general)
10. [Desarrolladores web](#desarrolladores-web)
11. [Programadores](#programadores)

---

## 1. Operaciones de limpieza
<details>
<summary>Ver comandos</summary>

| Comando | Función |
|---------|----------|
| `pancho.cleanWhitespace` | Limpiar espacios en blanco |
| `pancho.cleanLineEndings` | Limpiar saltos de línea |
| `pancho.toUpperCase` | Convertir a MAYÚSCULAS |
| `pancho.toLowerCase` | Convertir a minúsculas |
| `pancho.toTitleCase` | Convertir a Título |
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

## 3. Fin de línea
<details>
<summary>Ver comandos</summary>

| Comando | Función |
|---------|----------|
| `pancho.toWindowsEOL` | Convertir a Windows (CRLF) |
| `pancho.toUnixEOL` | Convertir a Unix (LF) |
| `pancho.toMacEOL` | Convertir a Mac (CR) |

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

## 5. Insertar
<details>
<summary>Ver comandos</summary>

| Comando | Función |
|---------|----------|
| `pancho.insertShortTime` | Fecha y hora corta |
| `pancho.insertLongTime` | Fecha y hora larga |
| `pancho.insertDateTime` | Fecha y hora (dd-MM-yyyy hh:mm:ss) |

</details>

---

## 6. Comentar / Descomentar
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

## 7. Pegado especial
<details>
<summary>Ver comandos</summary>

| Comando | Función |
|---------|----------|
| `pancho.pasteWithoutLineBreak` | Pegar sin salto de línea |
| `pancho.copyToMultipleLines` | Copiar a múltiples líneas |
| `pancho.formatAsCSV` | Formatear como CSV |

</details>

---

## 8. Caracteres especiales
<details>
<summary>Ver comandos</summary>

| Comando | Función |
|---------|----------|
| `pancho.insertDegree` | Grado (°) |
| `pancho.insertCopyright` | Copyright (©) |
| `pancho.insertRegistered` | Registrado (®) |
| `pancho.insertTrademark` | Trademark (™) |
| `pancho.insertSection` | Sección (§) |
| `pancho.insertPilcrow` | Pilcrow (¶) |
| `pancho.insertEllipsis` | Puntos suspensivos (…) |
| `pancho.insertBullet` | Viñeta (•) |
| `pancho.insertEuro` | Euro (€) |
| `pancho.insertPound` | Libra (£) |
| `pancho.insertYen` | Yen (¥) |

</details>

---

## 9. Texto general
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

</details>

---

## 10. Desarrolladores web
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
| `pancho.htmlEntitiesEncode` | Codificar HTML entities |
| `pancho.htmlEntitiesDecode` | Decodificar HTML entities |
| `pancho.base64Encode` | Codificar Base64 |
| `pancho.base64Decode` | Decodificar Base64 |
| `pancho.urlEncode` | Codificar URL |
| `pancho.urlDecode` | Decodificar URL |
| `pancho.hexToRgb` | Hex a RGB |
| `pancho.rgbToHex` | RGB a Hex |
| `pancho.loremIpsum` | Generar Lorem Ipsum |

</details>

---

## 11. Programadores
<details>
<summary>Ver comandos</summary>

| Comando | Función |
|---------|----------|
| `pancho.formatSQL` | Formatear SQL |
| `pancho.prettifyXML` | Formatear XML |
| `pancho.minifyXML` | Minificar XML |
| `pancho.generateUUID` | Generar UUID |
| `pancho.generateRandomString` | Generar cadena aleatoria |
| `pancho.hashMD5` | Hash MD5 |
| `pancho.hashSHA256` | Hash SHA-256 |
| `pancho.toBinary` | Texto a binario |
| `pancho.fromBinary` | Binario a texto |
| `pancho.toHex` | Texto a hexadecimal |
| `pancho.fromHex` | Hexadecimal a texto |

</details>

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
│   │   └── whitespace.ts
│   ├── utils/
│   │   └── editor.ts     # Utilidades de editor
│   └── extension.ts      # Entry point
├── dist/                  # Archivos compilados (no editar)
├── package.json          # Configuración de la extensión
├── tsconfig.json         # Configuración TypeScript
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

## Debugging

- Los logs aparecen en el **Debug Console** de VS Code
- Mensajes de error aparecen como notificaciones
- Para recargar: **F5** o **Developer: Reload Window**

---

<div align="center">
  <p>Hecho con ❤️ para panchos</p>
</div>
