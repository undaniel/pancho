# Pancho - VS Code Extension

<div align="center">
  <img src="pancho.png" alt="Pancho" width="200"/>
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

El menú contextual de Pancho tiene los siguientes submenús:

### Operaciones de limpieza

| Comando | Función |
|---------|---------|
| `pancho.cleanWhitespace` | Limpiar espacios duplicados, tabs y líneas vacías |
| `pancho.cleanLineEndings` | Limpiar saltos de línea Windows (^M) y caracteres especiales |
| `pancho.toUpperCase` | Convertir a MAYÚSCULAS |
| `pancho.toLowerCase` | Convertir a minúsculas |
| `pancho.toTitleCase` | Convertir a Título |
| `pancho.trimLines` | Recortar espacios al inicio y final de cada línea |
| `pancho.lineEndingsToSpaces` | Convertir saltos de línea a espacios |

### Tabulaciones

| Comando | Función |
|---------|---------|
| `pancho.convertTabsToSpaces` | Convertir tabs a espacios |
| `pancho.convertSpacesToTabs` | Convertir espacios a tabs |
| `pancho.increaseIndent` | Aumentar indentación |
| `pancho.decreaseIndent` | Disminuir indentación |

### Insertar

| Comando | Función |
|---------|---------|
| `pancho.insertShortTime` | Fecha y hora corta (16/5/2026 8:56 p.m.) |
| `pancho.insertLongTime` | Fecha y hora larga (sábado, 16 de mayo de 2026 8:56 p.m.) |
| `pancho.insertDateTime` | FechaHora (2026-05-16 20:56:51) |

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
│   │   ├── dateTime.ts
│   │   ├── lineEndings.ts
│   │   ├── lineUtils.ts
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

3. Agregar constante en `src/commands/registry.ts`:
   ```typescript
   NEW_COMMAND: 'pancho.newCommand',
   ```

4. Registrar en `src/commands/index.ts`:
   ```typescript
   registerTextCommand(context, {
       command: Commands.NEW_COMMAND,
       transform: (text) => myTransform(text),
   });
   ```

5. Compilar con `npm run compile`

6. Probar con **F5** (Extension Development Host)

---

## Debugging

- Los logs aparecen en el **Debug Console** de VS Code
- Mensajes de error aparecen como notificaciones
- Para recargar: **F5** o **Developer: Reload Window**

---

<div align="center">
  <p>Hecho con ❤️ para desarrolladores</p>
</div>