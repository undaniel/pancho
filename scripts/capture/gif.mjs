// Assembles screencast frames (PNG buffers) into an optimised GIF. Prefers
// ffmpeg (palette-based, much smaller files) and falls back to ImageMagick.
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'ignore' });
    child.on('error', reject);
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${command} exited with ${code}`))));
  });
}

export async function assembleGif(frames, out, { fps = 12, width = 1280 } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'pancho-gif-'));
  try {
    frames.forEach((buffer, index) => {
      writeFileSync(join(dir, `f${String(index).padStart(4, '0')}.png`), buffer);
    });
    const pattern = join(dir, 'f%04d.png');
    try {
      await run('ffmpeg', [
        '-y', '-loglevel', 'error',
        '-framerate', String(fps), '-i', pattern,
        '-vf', `scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
        '-loop', '0', out,
      ]);
    } catch {
      const delay = Math.max(2, Math.round(100 / fps));
      await run('magick', ['-delay', String(delay), '-loop', '0', join(dir, 'f*.png'), out]);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
