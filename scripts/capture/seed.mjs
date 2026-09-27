// Seeds the capture profile's global state before VS Code starts, so the
// screenshots show a populated UI (favorites, pipelines, recents) and the
// first-run walkthrough does not pop up. Best effort: if Node's sqlite module
// is unavailable the harness still runs, just with an empty state.
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const EXTENSION_ID = 'undaniels.pancho-plus-plus';

const STATE = {
  'pancho.walkthroughShown': true,
  'pancho.favoriteCommands': [
    'pancho.sortByColumn',
    'pancho.removeDuplicateLines',
    'pancho.formatAsCSV',
    'pancho.slugify',
    'pancho.regexTesterPanel',
  ],
  'pancho.recentCommands': [
    'pancho.removeDuplicateLines',
    'pancho.slugify',
    'pancho.base64Encode',
  ],
  'pancho.pipelines': [
    { name: 'Clean up a list', steps: ['pancho.trimLines', 'pancho.removeEmptyLines', 'pancho.removeDuplicateLines'] },
    { name: 'CSV to pretty JSON', steps: ['pancho.prettifyJSON', 'pancho.formatAsCSV'] },
    { name: 'Minify JSON then Base64', steps: ['pancho.minifyJSON', 'pancho.base64Encode'] },
  ],
};

export async function seedGlobalState(userData) {
  let DatabaseSync;
  try {
    ({ DatabaseSync } = await import('node:sqlite'));
  } catch {
    console.warn('› (sqlite unavailable; skipping state seed)');
    return;
  }

  const dir = join(userData, 'User', 'globalStorage');
  mkdirSync(dir, { recursive: true });
  const db = new DatabaseSync(join(dir, 'state.vscdb'));
  try {
    db.exec('CREATE TABLE IF NOT EXISTS ItemTable (key TEXT PRIMARY KEY, value BLOB)');
    db.prepare('INSERT OR REPLACE INTO ItemTable (key, value) VALUES (?, ?)')
      .run(EXTENSION_ID, JSON.stringify(STATE));
    console.log('› seeded favorites and pipelines');
  } catch (error) {
    console.warn(`› (state seed failed: ${error.message})`);
  } finally {
    db.close();
  }
}
