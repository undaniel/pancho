// Scene definitions for the capture harness. Each scene drives the real VS Code
// UI through CDP and saves a PNG under images/. `prepare` sets the stage (and is
// never recorded); `run` performs the action shown in the screenshot/GIF.
import { connectToWebview, sleep, MOD } from './cdp.mjs';

const ESC = ['Escape', 'Escape', 27];
const ENTER = ['Enter', 'Enter', 13];

/** Closes every editor and shows the Explorer, so each scene starts clean. */
async function reset(ctx) {
  const { client } = ctx;
  await client.tap(...ESC);
  await sleep(200);
  await client.tap('k', 'KeyK', 75, MOD.ctrl); // chord: Ctrl+K …
  await sleep(150);
  await client.tap('w', 'KeyW', 87, 0); // … W = Close All Editors
  await sleep(350);
  await client.evaluate(`(() => {
    const items = [...document.querySelectorAll('.activitybar .action-label, .activitybar [role="tab"], .activitybar li')];
    const el = items.find(n => /explorer/i.test(n.getAttribute('aria-label') || ''));
    if (el) el.click();
  })()`);
  await sleep(300);
}

async function openFile(ctx, filename) {
  const { client } = ctx;
  await reset(ctx);
  await client.tap('P', 'KeyP', 80, MOD.ctrl); // quick open
  await sleep(500);
  await client.type(filename);
  await sleep(900);
  await client.keyDown(...ENTER);
  await sleep(300);
  await client.keyUp(...ENTER);
  await sleep(700);
}

/** Selects the first `count` lines from the top of the document. */
async function selectFirstLines(ctx, count) {
  const { client } = ctx;
  await client.tap('Home', 'Home', 36, MOD.ctrl);
  for (let i = 0; i < count - 1; i++) {
    await client.keyDown('ArrowDown', 'ArrowDown', 40, MOD.shift);
    await client.keyUp('ArrowDown', 'ArrowDown', 40, MOD.shift);
  }
}

/** Copies the whole document to the OS clipboard via a real Ctrl+A / Ctrl+C. */
async function copyDocument(ctx) {
  const { client } = ctx;
  await client.tap('a', 'KeyA', 65, MOD.ctrl);
  await sleep(150);
  await client.tap('c', 'KeyC', 67, MOD.ctrl);
  await sleep(400);
}

async function showPanchoView(ctx) {  const clicked = await ctx.client.evaluate(`(() => {
    const items = [...document.querySelectorAll('.activitybar .action-label, .activitybar [role="tab"], .activitybar li')];
    const el = items.find(n => /pancho/i.test(n.getAttribute('aria-label') || n.textContent || ''));
    if (!el) return false;
    el.click();
    return true;
  })()`);
  if (!clicked) ctx.log('  (activity bar item not found)');
  await sleep(1000);
}

export const scenes = [
  {
    id: 'editor',
    description: 'Editor with a selection and status-bar counters',
    prepare: (ctx) => openFile(ctx, 'demo.txt'),
    async run(ctx) {
      await selectFirstLines(ctx, 4);
      await sleep(600);
      await ctx.shot('images/screenshot-editor.png');
    },
  },
  {
    id: 'command-hub',
    description: 'Command hub (quick pick) with categories and shortcuts',
    gif: true,
    prepare: (ctx) => openFile(ctx, 'demo.txt'),
    async run(ctx) {
      await ctx.client.runCommand('Pancho: Show command menu', { settle: 1300 });
      await ctx.shot('images/screenshot-command-hub.png');
      await ctx.client.tap(...ESC);
    },
  },
  {
    id: 'sort-preview',
    description: 'Diff preview before running a destructive command',
    prepare: async (ctx) => {
      await openFile(ctx, 'demo.txt');
      await ctx.client.tap('a', 'KeyA', 65, MOD.ctrl);
      await sleep(300);
    },
    async run(ctx) {
      await ctx.client.runCommand('Pancho: Sort lines (natural)', { settle: 2000 });
      await ctx.shot('images/screenshot-sort-preview.png');
      await ctx.client.tap(...ESC); // cancel the apply dialog
      await sleep(300);
    },
  },
  {
    id: 'regex-panel',
    description: 'Regex tester panel with live matches',
    prepare: (ctx) => openFile(ctx, 'demo.txt'),
    async run(ctx) {
      await ctx.client.runCommand('Pancho: Regex tester panel', { settle: 1500 });
      try {
        const webview = await connectToWebview(ctx.port);
        const pattern = '\\b\\w{4,}\\b';
        const setPattern = `(() => {
          const p = document.getElementById('pattern');
          if (!p) return null;
          p.value = ${JSON.stringify(pattern)};
          p.dispatchEvent(new Event('input', { bubbles: true }));
          return p.value;
        })()`;
        for (const frameId of await webview.frameIds()) {
          if (await webview.evaluateInFrame(frameId, setPattern) !== null) break;
        }
        await sleep(1200);
        webview.close();
      } catch (error) {
        ctx.log(`  (regex panel webview: ${error.message})`);
      }
      await ctx.shot('images/screenshot-regex-panel.png');
    },
  },
  {
    id: 'compare',
    description: 'Compare the clipboard with the selection in a diff',
    prepare: async (ctx) => {
      await openFile(ctx, 'data.csv');
      await copyDocument(ctx);
      await openFile(ctx, 'demo.txt');
      await selectFirstLines(ctx, 6);
    },
    async run(ctx) {
      await ctx.client.runCommand('Pancho: Compare with Clipboard', { settle: 2200 });
      await ctx.shot('images/screenshot-compare.png');
      await ctx.client.tap(...ESC);
    },
  },
  {
    id: 'activity-view',
    description: 'Activity Bar view with Favorites / Recent / Pipelines',
    prepare: (ctx) => openFile(ctx, 'demo.txt'),
    async run(ctx) {
      await showPanchoView(ctx);
      await ctx.shot('images/screenshot-activity-view.png');
    },
  },
  {
    id: 'context-menu',
    description: 'Editor context menu with the Pancho submenu',
    prepare: (ctx) => openFile(ctx, 'demo.txt'),
    async run(ctx) {
      const point = await ctx.client.evaluate(`(() => {
        const el = document.querySelector('.monaco-editor');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x + r.width * 0.5, y: r.y + r.height * 0.35 };
      })()`);
      if (!point) {
        ctx.log('  (editor not found)');
        return;
      }
      await ctx.client.mouseAt(point.x, point.y, { button: 'right' });
      await sleep(900);
      await ctx.client.tap('ArrowUp', 'ArrowUp', 38); // last entry = "Pancho"
      await sleep(300);
      await ctx.client.tap('ArrowRight', 'ArrowRight', 39); // open the submenu
      await sleep(900);
      await ctx.shot('images/screenshot-context-menu.png');
      await ctx.client.tap(...ESC);
    },
  },
];
