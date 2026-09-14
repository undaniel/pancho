'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const BUNDLE = path.join(ROOT, 'l10n', 'bundle.l10n.json');

// Matches `vscode.l10n.t('...')` / `l10n.t('...')` and the local `t('...')` wrapper.
const PATTERNS = [
    /(?:vscode\.l10n|l10n)\.t\(\s*(['"])((?:\\.|(?!\1).)*)\1/g,
    /(?:^|[^\w.$])t\(\s*(['"])((?:\\.|(?!\1).)*)\1/g,
];

function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) files.push(...walk(full));
        else if (entry.isFile() && entry.name.endsWith('.ts')) files.push(full);
    }
    return files;
}

function collectMessages(root = ROOT) {
    const messages = new Set();
    for (const file of walk(path.join(root, 'src'))) {
        const content = fs.readFileSync(file, 'utf8');
        for (const pattern of PATTERNS) {
            const regex = new RegExp(pattern.source, pattern.flags);
            let match;
            while ((match = regex.exec(content)) !== null) {
                messages.add(match[2]);
            }
        }
    }
    return messages;
}

function checkL10n(root = ROOT) {
    const source = collectMessages(root);
    const bundlePath = path.join(root, 'l10n', 'bundle.l10n.json');
    const bundle = JSON.parse(fs.readFileSync(bundlePath, 'utf8'));

    const missing = [...source].filter(key => !(key in bundle)).sort();
    const orphan = Object.keys(bundle).filter(key => !source.has(key)).sort();
    return { missing, orphan };
}

if (require.main === module) {
    const { missing, orphan } = checkL10n();
    if (orphan.length > 0) {
        console.warn(`l10n: ${orphan.length} unused bundle key(s):`);
        for (const key of orphan) console.warn('  - ' + key);
    }
    if (missing.length > 0) {
        console.error(`l10n: ${missing.length} string(s) used in src/ but missing from bundle.l10n.json:`);
        for (const key of missing) console.error('  - ' + key);
        process.exit(1);
    }
    console.log('l10n: OK (all runtime strings are present in the bundle)');
}

module.exports = { collectMessages, checkL10n };
