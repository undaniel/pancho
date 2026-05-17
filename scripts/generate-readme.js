const fs = require('fs');
const path = require('path');
const projectRoot = path.join(__dirname, '..');

const submenuMap = {
    panchoOperaciones: {
        name: 'Operaciones de limpieza',
        commands: [
            'pancho.cleanWhitespace',
            'pancho.cleanLineEndings',
            'pancho.toUpperCase',
            'pancho.toLowerCase',
            'pancho.toTitleCase',
            'pancho.trimLines',
            'pancho.lineEndingsToSpaces',
        ]
    },
    panchoTabulaciones: {
        name: 'Tabulaciones',
        commands: [
            'pancho.convertTabsToSpaces',
            'pancho.convertSpacesToTabs',
            'pancho.increaseIndent',
            'pancho.decreaseIndent',
        ]
    },
    panchoInsertar: {
        name: 'Insertar',
        commands: [
            'pancho.insertShortTime',
            'pancho.insertLongTime',
            'pancho.insertDateTime',
        ]
    },
    panchoComentarios: {
        name: 'Comentar / Descomentar',
        commands: [
            'pancho.commentLine',
            'pancho.uncommentLine',
            'pancho.commentBlock',
            'pancho.uncommentBlock',
        ]
    }
};

function extractCommandList() {
    const registryPath = path.join(projectRoot, 'src/commands/registry.ts');
    const content = fs.readFileSync(registryPath, 'utf-8');

    const match = content.match(/export const CommandList[^;]*;/s);
    if (!match) return {};

    const commandMap = {};
    const arrayMatch = match[0].match(/\[([\s\S]*?)\];/);
    if (!arrayMatch) return {};

    const items = arrayMatch[1].matchAll(/\{ name: Commands\.(\w+)[^}]+\}/g);
    for (const item of items) {
        const key = item[1];
        const fullMatch = item[0];
        const titleMatch = fullMatch.match(/title:\s*'([^']+)'/);
        if (titleMatch) {
            commandMap[key] = titleMatch[1];
        }
    }

    return commandMap;
}

function extractPackageJson() {
    const pkgPath = path.join(projectRoot, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

    const commandTitles = {};
    for (const cmd of pkg.contributes.commands) {
        commandTitles[cmd.command] = cmd.title;
    }

    return commandTitles;
}

function generateReadmeContent(commandMap, packageCommands) {
    let toc = '## Menú Pancho\n\n';
    toc += '> Lista de comandos disponible en el menú contextual\n\n';

    let index = 1;
    for (const submenu of Object.values(submenuMap)) {
        const anchor = submenu.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        toc += `${index}. [${submenu.name}](#${anchor})\n`;
        index++;
    }

    toc += '\n---\n\n';

    index = 1;
    for (const [submenuId, submenu] of Object.entries(submenuMap)) {
        const anchor = submenu.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        toc += `## ${index}. ${submenu.name}\n`;
        toc += '<details>\n<summary>Ver comandos</summary>\n\n';
        toc += '| Comando | Función |\n|---------|----------|\n';

for (const cmd of submenu.commands) {
            const title = packageCommands[cmd] || cmd;
            toc += '| `' + cmd + '` | ' + title + ' |\n';
        }

        toc += '\n</details>\n\n---\n\n';
        index++;
    }

    return toc;
}

function main() {
    const commandMap = extractCommandList();
    const packageCommands = extractPackageJson();

    const generatedContent = generateReadmeContent(commandMap, packageCommands);

    const header = `# Pancho - VS Code Extension

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

`;

    const footer = `
## Estructura del proyecto

\`\`\`
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
\`\`\`

---

## Para agregar un nuevo comando

1. Agregar comando en \`package.json\` y submenú correspondiente

2. Crear función de transformación en \`src/transforms/*.ts\`

3. Agregar constante en \`src/commands/registry.ts\`

4. Registrar en \`src/commands/index.ts\`

5. Compilar con \`npm run compile\`

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
`;

    const readme = header + generatedContent + footer;

    fs.writeFileSync(path.join(projectRoot, 'README.md'), readme);
    console.log('README.md generado correctamente');
}

main();