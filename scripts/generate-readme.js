const fs = require('fs');
const path = require('path');
const projectRoot = path.join(__dirname, '..');

function extractPackageJson() {
    const pkgPath = path.join(projectRoot, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

    const commandTitles = {};
    for (const cmd of pkg.contributes.commands) {
        commandTitles[cmd.command] = cmd.title;
    }

    const submenus = {};
    for (const submenu of pkg.contributes.submenus) {
        if (submenu.id !== 'panchoMenu') {
            submenus[submenu.id] = {
                name: submenu.label,
                commands: []
            };
        }
    }

    const menus = pkg.contributes.menus;
    for (const [menuId, items] of Object.entries(menus)) {
        if (menuId !== 'editor/context' && menuId !== 'panchoMenu' && submenus[menuId]) {
            for (const item of items) {
                if (item.command) {
                    submenus[menuId].commands.push(item.command);
                }
            }
        }
    }

    return { commandTitles, submenus };
}

function generateTableOfContents(submenus) {
    let toc = '';
    let index = 1;
    for (const submenu of Object.values(submenus)) {
        const anchor = submenu.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        toc += `${index}. [${submenu.name}](#${anchor})\n`;
        index++;
    }
    return toc;
}

function generateCommandsContent(commandTitles, submenus) {
    let content = '';
    let index = 1;
    for (const submenu of Object.values(submenus)) {
        const anchor = submenu.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        content += `## ${index}. ${submenu.name}\n`;
        content += '<details>\n<summary>Ver comandos</summary>\n\n';
        content += '| Comando | Función |\n|---------|----------|\n';

        for (const cmd of submenu.commands) {
            const title = commandTitles[cmd] || cmd;
            content += '| `' + cmd + '` | ' + title + ' |\n';
        }

        content += '\n</details>\n\n---\n\n';
        index++;
    }
    return content;
}

function main() {
    const { commandTitles, submenus } = extractPackageJson();

    const templatePath = path.join(__dirname, 'templates', 'README.md');
    let template = fs.readFileSync(templatePath, 'utf-8');

    template = template.replace('{{TABLE_OF_CONTENTS}}', generateTableOfContents(submenus));
    template = template.replace('{{COMMANDS_CONTENT}}', generateCommandsContent(commandTitles, submenus));

    fs.writeFileSync(path.join(projectRoot, 'README.md'), template);
    console.log('README.md generado correctamente');
}

main();