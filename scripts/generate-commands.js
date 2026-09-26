const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const pkgPath = path.join(root, 'package.json');
const distPath = path.join(root, 'dist', 'commands', 'registry.js');

if (!fs.existsSync(distPath)) {
  console.error('No existe dist/commands/registry.js. Ejecuta "npm run compile" primero.');
  process.exit(1);
}

const { commandManifest, Categories } = require(distPath);
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

const commands = Object.values(commandManifest).map(entry => {
  const generated = {
    command: entry.id,
    title: `%command.${entry.id}.title%`,
    category: Categories[entry.category],
  };
  if (entry.enablement) generated.enablement = entry.enablement;
  return generated;
});

pkg.contributes.commands = commands;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`contributes.commands sincronizado (${commands.length} comandos)`);
