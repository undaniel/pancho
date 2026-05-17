# Pancho - VS Code Extension

Extensión para limpiar y formatear texto como Notepad++.

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

## Estructura del proyecto

```
pancho/
├── src/
│   └── extension.ts      # Código principal de la extensión
├── dist/                  # Archivos compilados (no editar)
├── package.json          # Configuración de la extensión
├── tsconfig.json         # Configuración TypeScript
└── .vscode/
    └── launch.json       # Configuración para depuración (F5)
```

## Para agregar un nuevo comando

1. Agregar el comando en `package.json`:
   - En `contributes.commands` con `command` y `title`
   - En `contributes.menus` según el submenú correspondiente (`panchoOperaciones` o `panchoTabulaciones`)

2. Agregar la función en `src/extension.ts`:
   - Crear función de transformación de texto
   - Registrar el comando con `registerCommand`

3. Compilar con `npm run compile`

4. Probar con **F5** (Extension Development Host)

## Debugging

- Los logs aparecen en el **Debug Console** de VS Code
- Mensajes de error aparecen como notificaciones
- Para recargar: **F5** o **Developer: Reload Window**