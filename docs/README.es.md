# Pancho

[![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)](../CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](../LICENSE)
[![VSCode Engine](https://img.shields.io/badge/VSCode-%5E1.80.0-blue.svg)](https://code.visualstudio.com/)

[![Marketplace](https://img.shields.io/visual-studio-marketplace/v/undaniels.pancho-plus-plus)](https://marketplace.visualstudio.com/items?itemName=undaniels.pancho-plus-plus)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/undaniels.pancho-plus-plus)](https://marketplace.visualstudio.com/items?itemName=undaniels.pancho-plus-plus)
[![Open VSX](https://img.shields.io/open-vsx/v/undaniels/pancho-plus-plus)](https://open-vsx.org/extension/undaniels/pancho-plus-plus)

> Limpia, formatea y transforma texto como Notepad++

<img src="../pancho.webp" alt="Pancho" width="256" />

**Idioma:** [English](../README.md) · Español

**Índice:** [Características](#características) · [Top 10](#top-10-comandos) · [Cómo usar](#cómo-usar) · [Comandos](#comandos) · [Demos](./demos.md) · [Atajos](#atajos-de-teclado) · [Configuración](#configuración)

---

## Instalación

- **VS Code Marketplace:** [Pancho++](https://marketplace.visualstudio.com/items?itemName=undaniels.pancho-plus-plus)
- **Open VSX:** [undaniels/pancho-plus-plus](https://open-vsx.org/extension/undaniels/pancho-plus-plus)
- O ejecuta `ext install undaniels.pancho-plus-plus`.

---

## Características

- **138 comandos** accesibles desde el menú contextual
- **Hub de comandos** (`Pancho: Mostrar menú de comandos`) con categorías, atajos y usados recientemente
- **Compatible con multi-cursor y multi-selección**: las transformaciones se aplican por cursor/selección
- **Repetir último comando** (`Ctrl+Shift+.`)
- **Vista previa (diff)** para comandos destructivos (opcional)
- **Modo columna**: insertar / eliminar / copiar / pegar bloques de columna
- **Macros**: grabar, reproducir, guardar y exportar/importar secuencias de comandos
- **Información al pasar el mouse**: decodifica JWT, timestamps, colores y Base64 solo con el hover
- **Quick fixes** (Code Actions): detecta JWT / JSON / CSV / hex y convierte en el sitio
- **Panel de test de regex** con coincidencias en vivo, grupos y vista previa de reemplazo
- **Historial de portapapeles** (`Ctrl+Alt+V`) y **ordenar por columna**
- **Motor de regex seguro** con timeout (sin ventanas congeladas)
- **Contadores en barra de estado** (líneas, palabras, caracteres)
- **Atajos de teclado** para operaciones frecuentes
- **Configuración** de tabulación, EOL y más
- **Interfaz en inglés y español** (sigue el idioma de VS Code)

## Top 10 comandos

¿Primera vez? Estos son los que más se usan:

| Comando | Qué hace | Atajo |
|---------|----------|-------|
| Mostrar menú de comandos | Hub con buscador de todo lo que hace Pancho | — |
| Ordenar por columna... | Ordena filas CSV/TSV por una columna | — |
| Eliminar líneas duplicadas | Quita duplicados de una lista | `Ctrl+Shift+D` |
| Panel de test de regex | Coincidencias en vivo, grupos y reemplazo | `Ctrl+Alt+R` |
| Historial de portapapeles... | Re-pega algo que copiaste hace poco | `Ctrl+Alt+V` |
| Decodificar JWT | Decodifica un token (también hover / quick fix) | — |
| Columna: rellenar serie... | Rellena una columna con una serie incremental | — |
| CSV a JSON / JSON a CSV | Convierte datos tabulares en ambos sentidos | — |
| Macro: grabar y reproducir | Automatiza ediciones repetitivas | — |
| Alinear por = | Alinea asignaciones / tablas | — |

Más ejemplos en [demos.md](./demos.md).

## Por qué Pancho

- **Memoria muscular de Notepad++** en VS Code: las mismas operaciones de texto, en el menú contextual.
- **Consciente del contexto:** pasa el mouse por un JWT/timestamp/color y lo ves decodificado; selecciona JSON/CSV/JWT y conviértelo con la bombilla.
- **Seguro por diseño:** sin red, sin telemetría, regex en un worker con timeout, AES-256-GCM.
- **Chico pero completo:** una extensión para formateo, escapado, hashing, codificación, CSV, macros y columnas.

## Privacidad y seguridad

- **Sin telemetría ni acceso a red.** Pancho funciona completamente en local y nunca envía tu texto a ningún sitio.
- **Motor de regex seguro.** Las expresiones regulares del usuario se ejecutan en un worker thread aislado con timeout, así un patrón catastrófico no puede congelar VS Code.
- **Cifrado autenticado.** El cifrado AES usa AES-256-GCM con salt aleatorio por mensaje (los datos antiguos en CBC siguen siendo legibles).
- **Consciente del workspace trust.** Pancho declara soporte limitado en workspaces no confiables y no requiere acceso a red.

## Cómo usar

1. Selecciona texto (o no, para aplicar a todo el documento)
2. Clic derecho → **Pancho**
3. Elige la categoría y el comando

## Comandos

Los **138 comandos** se agrupan en: Edición, Líneas, Mayúsculas y minúsculas, Tabulaciones, Fin de línea, Texto general, Codificación, Formateo, Hash y binario, Insertar, Comentar, Desarrolladores, Columnas, Macros, Escapar, Herramientas de desarrollo y Hub de comandos.

Lista completa con descripciones: **[Comandos de Pancho](./commands.es.md)**.

## Integraciones con VS Code

Algunos comandos conservan su entrada de menú y atajo de Pancho pero **delegan en la implementación nativa de VS Code** (consistencia y soporte multi-cursor): mayúsculas / minúsculas / título, comentar y comentar bloque, tabs↔espacios, indentar/desindentar, mover / duplicar / insertar línea, ordenar A–Z / Z–A y unir líneas.

## Atajos de teclado

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
| `Ctrl+Shift+.` | `Cmd+Shift+.` | Repetir último comando |
| `Ctrl+Alt+V` | `Cmd+Alt+V` | Historial de portapapeles |
| `Ctrl+Alt+R` | `Cmd+Alt+R` | Panel de test de regex |

> Los atajos en Mac usan `Cmd+Alt+...` para evitar chocar con los nativos de VS Code (`Cmd+Shift+W` cierra ventana, etc.).
>
> Algunos atajos chocan con los del sistema en ciertas plataformas (`Ctrl+Shift+U` es "insertar Unicode" en Linux, `Ctrl+Shift+S` es "Guardar como" en algunos editores). Si te molesta, reasígnalos en **Atajos de teclado** (`Ctrl+K Ctrl+S`) buscando `pancho`.

## Configuración

| Opción | Default | Descripción |
|--------|---------|-------------|
| `pancho.tabSize` | `4` | Tamaño de tabulación |
| `pancho.defaultEOL` | `LF` | Fin de línea por defecto |
| `pancho.statusBarShowCounters` | `true` | Mostrar contadores |
| `pancho.maxFileSizeKB` | `5120` | Tamaño máximo de archivo |
| `pancho.loremIpsumWordCount` | `50` | Palabras en Lorem Ipsum |
| `pancho.randomStringLength` | `16` | Longitud de string aleatorio |
| `pancho.regexTimeoutMs` | `2000` | Tiempo máximo (ms) de una regex antes de abortar |
| `pancho.previewDestructive` | `false` | Mostrar diff antes de comandos destructivos |
| `pancho.clipboardHistoryEnabled` | `true` | Registra el portapapeles en segundo plano |
| `pancho.clipboardHistorySize` | `20` | Máximo de entradas del portapapeles |

## Contadores en barra de estado

Pancho muestra `L:X P:Y C:Z` (Líneas, Palabras, Caracteres) en la barra de estado. Cuando hay selección cambia a `Sel L:X P:Y C:Z` para distinguir el conteo de la selección del total del documento.

---

## Contribuir

Issues y pull requests en [github.com/undaniel/pancho](https://github.com/undaniel/pancho).

```bash
npm install
npm run compile   # typecheck
npm test          # tests unitarios
npm run l10n:check
npm run bundle    # genera dist/
```

Luego pulsa `F5` en VS Code para lanzar el Extension Development Host. Historial de versiones en [CHANGELOG.md](../CHANGELOG.md).

## Licencia

[MIT](../LICENSE) © Daniel Carrasco
