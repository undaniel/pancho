'use strict';

/*
 * Keeps the "N commands" total in the docs in sync with the manifest.
 *
 * The README and the command reference are hand-maintained, so this script does
 * NOT regenerate them: it only updates the bolded command count in place and
 * never overwrites prose. Idempotent and safe to run any time.
 *
 *   npm run generate:readme
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf-8'));
const count = pkg.contributes.commands.length;

// Docs that state the total command count as `**N commands**` / `**N comandos**`.
const DOCS = [
    'README.md',
    'docs/README.es.md',
    'docs/commands.md',
    'docs/commands.es.md',
    'docs/marketplace.md',
];

const COUNT_PATTERN = /\*\*(\d+)( (?:commands|comandos))\*\*/g;

function syncCounts() {
    let changed = 0;
    for (const relative of DOCS) {
        const file = path.join(projectRoot, relative);
        if (!fs.existsSync(file)) continue;

        const before = fs.readFileSync(file, 'utf-8');
        const after = before.replace(COUNT_PATTERN, `**${count}$2**`);

        if (after !== before) {
            fs.writeFileSync(file, after);
            changed++;
            console.log(`Updated ${relative}`);
        }
    }
    return changed;
}

function main() {
    const changed = syncCounts();
    console.log(`Command count: ${count}. Updated ${changed} file(s).`);
}

main();
