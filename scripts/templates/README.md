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

{{TABLE_OF_CONTENTS}}

---

{{COMMANDS_CONTENT}}

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