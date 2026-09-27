// Minimal Chrome DevTools Protocol client built on Node's global fetch/WebSocket
// (Node 22+). No external dependencies. It is used by the capture harness to
// drive the real VS Code UI — including command palette input — and to grab
// screenshots of the workbench page, which works on Wayland where no system
// screenshot tool can see the window.

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// CDP modifier bitmask.
export const MOD = { alt: 1, ctrl: 2, meta: 4, shift: 8 };

export class CdpClient {
  constructor(ws) {
    this.ws = ws;
    this.nextId = 0;
    this.pending = new Map();
    this.listeners = new Map();
    ws.addEventListener('message', (event) => this.#onMessage(event));
  }

  #onMessage(event) {
    const message = JSON.parse(event.data);
    if (message.id && this.pending.has(message.id)) {
      const { resolve, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) reject(new Error(`${message.error.message} (${JSON.stringify(message.error)})`));
      else resolve(message.result);
      return;
    }
    if (message.method) {
      for (const listener of this.listeners.get(message.method) ?? []) listener(message.params);
    }
  }

  on(method, listener) {
    if (!this.listeners.has(method)) this.listeners.set(method, new Set());
    this.listeners.get(method).add(listener);
    return () => this.listeners.get(method)?.delete(listener);
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.nextId;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws.close();
  }

  // ---- input ----

  keyDown(key, code, vk, modifiers = 0) {
    return this.send('Input.dispatchKeyEvent', {
      type: 'keyDown', modifiers, key, code,
      windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk,
    });
  }

  keyUp(key, code, vk, modifiers = 0) {
    return this.send('Input.dispatchKeyEvent', {
      type: 'keyUp', modifiers, key, code,
      windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk,
    });
  }

  async tap(key, code, vk, modifiers = 0) {
    await this.keyDown(key, code, vk, modifiers);
    await this.keyUp(key, code, vk, modifiers);
  }

  /** Types unicode text without relying on per-key layouts. */
  async type(text) {
    for (const char of text) await this.send('Input.insertText', { text: char });
  }

  async mouseAt(x, y, { button = 'left', clickCount = 1 } = {}) {
    const base = { x, y, button, clickCount, buttons: button === 'right' ? 2 : 1 };
    await this.send('Input.dispatchMouseEvent', { type: 'mousePressed', ...base });
    await this.send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...base });
  }

  async mouseMove(x, y) {
    await this.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, buttons: 0 });
  }

  // ---- helpers ----

  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', { expression, returnByValue: true });
    return result.result?.value;
  }

  /** Evaluates inside a specific frame (webviews put their DOM in a child frame). */
  async evaluateInFrame(frameId, expression) {
    const { executionContextId } = await this.send('Page.createIsolatedWorld', {
      frameId, worldName: 'pancho-capture', grantUniveralAccess: true,
    });
    const result = await this.send('Runtime.evaluate', {
      expression, contextId: executionContextId, returnByValue: true,
    });
    return result.result?.value;
  }

  /** Returns every frame id in this target, root first. */
  async frameIds() {
    const { frameTree } = await this.send('Page.getFrameTree');
    const ids = [];
    const walk = (node) => {
      ids.push(node.frame.id);
      for (const child of node.childFrames ?? []) walk(child);
    };
    walk(frameTree);
    return ids;
  }

  /**
   * Opens the command palette and runs `command`, accepting on keydown so the
   * following keyup cannot land on whatever UI the command opens.
   */
  async runCommand(command, { settle = 900, clear = true } = {}) {
    if (clear) await this.tap('Escape', 'Escape', 27);
    await sleep(200);
    await this.tap('P', 'KeyP', 80, MOD.ctrl | MOD.shift);
    await sleep(500);
    await this.type(command);
    await sleep(600);
    await this.keyDown('Enter', 'Enter', 13);
    await sleep(settle);
  }

  async shot(file) {
    const { data } = await this.send('Page.captureScreenshot', { format: 'png' });
    const { writeFile } = await import('node:fs/promises');
    await writeFile(file, Buffer.from(data, 'base64'));
    return file;
  }

  /** Records the page via the CDP screencast and returns the captured frames. */
  async record(frames, action, { everyNthFrame = 1, maxWidth = 1600 } = {}) {
    const onFrame = this.on('Page.screencastFrame', (params) => {
      frames.push(Buffer.from(params.data, 'base64'));
      this.send('Page.screencastFrameAck', { sessionId: params.sessionId }).catch(() => {});
    });
    await this.send('Page.startScreencast', { format: 'png', everyNthFrame, maxWidth });
    try {
      await action();
    } finally {
      await this.send('Page.stopScreencast');
      onFrame();
    }
    return frames;
  }
}

async function listTargets(port) {
  const response = await fetch(`http://127.0.0.1:${port}/json`);
  return response.json();
}

export async function connectToWorkbench(port, { timeoutMs = 40000 } = {}) {
  if (typeof globalThis.WebSocket !== 'function') {
    throw new Error('This harness needs Node 22+ (global WebSocket is missing).');
  }
  const deadline = Date.now() + timeoutMs;
  let target;
  while (Date.now() < deadline) {
    try {
      const targets = await listTargets(port);
      target = targets.find((t) => t.type === 'page' && /workbench\.html/.test(t.url));
      if (target) break;
    } catch {
      // Server not up yet.
    }
    await sleep(400);
  }
  if (!target) throw new Error(`VS Code did not expose a workbench target on port ${port}`);

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  return new CdpClient(ws);
}

/** Finds the webview (regex panel) target and connects to it. */
export async function connectToWebview(port, { match = /vscode-webview/, timeoutMs = 15000 } = {}) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const targets = await listTargets(port);
    const target = targets.find((t) => t.type === 'iframe' || (t.type === 'page' && match.test(t.url)));
    if (target) {
      const ws = new WebSocket(target.webSocketDebuggerUrl);
      await new Promise((resolve, reject) => {
        ws.addEventListener('open', resolve, { once: true });
        ws.addEventListener('error', reject, { once: true });
      });
      return new CdpClient(ws);
    }
    await sleep(300);
  }
  throw new Error('No webview target found');
}

export { sleep };
