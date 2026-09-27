// Screenshot harness for the Marketplace listing.
//
// It launches a real VS Code (Extension Development Host) with remote debugging
// enabled, drives the workbench through the Chrome DevTools Protocol and saves
// PNGs under images/. This works on Wayland, where no system screenshot tool can
// see the window, and avoids capturing the desktop (no personal data).
//
// Usage:
//   npm run capture                 # all scenes
//   npm run capture -- --only=command-hub,regex-panel
//   npm run capture -- --gif        # also record GIFs for scenes marked `gif`
//   npm run capture -- --no-build   # skip `npm run bundle`
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdtempSync, mkdirSync, rmSync, cpSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectToWorkbench, sleep } from './cdp.mjs';
import { scenes } from './scenes.mjs';
import { seedGlobalState } from './seed.mjs';

const require = createRequire(import.meta.url);
const { downloadAndUnzipVSCode } = require('@vscode/test-electron');

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const PORT = Number(process.env.PANCHO_CAPTURE_PORT ?? 9333);

const args = process.argv.slice(2);
const hasFlag = (name) => args.includes(`--${name}`);
const valueOf = (name) => {
  const withEquals = args.find((a) => a.startsWith(`--${name}=`));
  return withEquals ? withEquals.slice(name.length + 3) : undefined;
};

function sh(command, commandArgs, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, { stdio: 'inherit', ...options });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${command} exited with ${code}`))));
    child.on('error', reject);
  });
}

async function main() {
  if (!hasFlag('no-build')) {
    console.log('› bundling extension…');
    await sh('npm', ['run', 'bundle'], { cwd: ROOT, shell: process.platform === 'win32' });
  }

  const selected = valueOf('only')?.split(',').map((s) => s.trim());
  const toRun = selected ? scenes.filter((s) => selected.includes(s.id)) : scenes;
  if (toRun.length === 0) throw new Error(`No scenes matched. Known ids: ${scenes.map((s) => s.id).join(', ')}`);

  mkdirSync(join(ROOT, 'images'), { recursive: true });
  const profile = mkdtempSync(join(tmpdir(), 'pancho-capture-'));
  const userData = join(profile, 'user-data');
  const extensions = join(profile, 'extensions');

  // Copy the demo workspace outside the repository: no Git, no personal data.
  const workspace = join(profile, 'workspace');
  cpSync(join(ROOT, 'scripts', 'capture', 'workspace'), workspace, { recursive: true });

  // A clean, quiet profile so screenshots have no notifications or prompts.
  mkdirSync(join(userData, 'User'), { recursive: true });
  writeFileSync(join(userData, 'User', 'settings.json'), JSON.stringify({
    'git.enabled': false,
    'git.openRepositoryInParentFolders': 'never',
    'security.workspace.trust.enabled': false,
    'update.mode': 'none',
    'telemetry.telemetryLevel': 'off',
    'extensions.autoUpdate': false,
    'workbench.startupEditor': 'none',
    'workbench.tips.enabled': false,
    'workbench.enableExperiments': false,
    'window.commandCenter': false,
    'workbench.layoutControl.enabled': false,
    'chat.commandCenter.enabled': false,
    'workbench.secondarySideBar.defaultVisibility': 'hidden',
    'editor.minimap.enabled': true,
    'workbench.colorTheme': 'Default Dark Modern',
  }, null, 2));

  await seedGlobalState(userData);

  console.log('› resolving VS Code…');
  const code = await downloadAndUnzipVSCode('stable');

  const launchArgs = [
    `--user-data-dir=${userData}`,
    `--extensions-dir=${extensions}`,
    `--extensionDevelopmentPath=${ROOT}`,
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-sandbox',
    '--disable-workspace-trust',
    '--disable-telemetry',
    '--skip-welcome',
    '--skip-release-notes',
    '--password-store=basic',
    workspace,
  ];

  console.log(`› launching VS Code (port ${PORT})…`);
  const child = spawn(code, launchArgs, { stdio: 'ignore', detached: false });

  const cleanup = () => {
    try { child.kill('SIGKILL'); } catch { /* already gone */ }
    try { rmSync(profile, { recursive: true, force: true }); } catch { /* best effort */ }
  };
  process.on('SIGINT', () => { cleanup(); process.exit(130); });

  try {
    const client = await connectToWorkbench(PORT);
    await sleep(2500); // let activation settle before the first scene

    const ctx = {
      client,
      port: PORT,
      root: ROOT,
      log: (message) => console.log(message),
      shot: async (relative) => {
        const file = join(ROOT, relative);
        await client.shot(file);
        console.log(`  saved ${relative}`);
        return file;
      },
      recordGif: async (relative, action) => {
        const frames = [];
        await client.record(frames, action, {});
        if (frames.length === 0) return;
        const { assembleGif } = await import('./gif.mjs');
        // Compress the recording to roughly 6 seconds so GIFs stay snappy.
        const fps = Math.min(30, Math.max(8, Math.round(frames.length / 6)));
        await assembleGif(frames, join(ROOT, relative), { fps });
        console.log(`  saved ${relative} (${frames.length} frames @ ${fps}fps)`);
      },
    };

    for (const scene of toRun) {
      console.log(`› scene: ${scene.id} — ${scene.description}`);
      if (scene.prepare) await scene.prepare(ctx);
      if (hasFlag('gif') && scene.gif) {
        await ctx.recordGif(`images/demo-${scene.id}.gif`, () => scene.run(ctx));
      } else {
        await scene.run(ctx);
      }
    }

    client.close();
    console.log('› done');
  } finally {
    cleanup();
  }
}

main().catch((error) => {
  console.error(`capture failed: ${error.stack ?? error.message}`);
  process.exit(1);
});
