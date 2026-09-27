import * as esbuild from 'esbuild';
import { rmSync } from 'fs';

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

// esbuild does not remove files from previous builds (e.g. a stale `tsc`
// compile). Start from a clean output directory so the package never ships
// dead code.
rmSync('dist', { recursive: true, force: true });

const shared = {
    bundle: true,
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    logLevel: 'info',
    external: ['vscode'],
};

// Desktop / remote extension host (Node).
const nodeCtx = await esbuild.context({
    ...shared,
    entryPoints: ['src/extension.ts', 'src/workers/regexWorker.ts'],
    format: 'cjs',
    platform: 'node',
    outdir: 'dist',
    outbase: 'src',
});

// Web extension host (vscode.dev / github.dev). Node built-ins are marked
// external so the lazy `require`s in safeRegex.ts stay out of the bundle.
const webCtx = await esbuild.context({
    ...shared,
    entryPoints: ['src/extension.ts'],
    format: 'cjs',
    platform: 'browser',
    outdir: 'dist/web',
    outbase: 'src',
    external: [
        'vscode',
        'worker_threads',
        'node:worker_threads',
        'crypto',
        'node:crypto',
        'fs',
        'node:fs',
        'path',
        'node:path',
    ],
});

if (watch) {
    await Promise.all([nodeCtx.watch(), webCtx.watch()]);
    console.log('Watching for changes...');
} else {
    await Promise.all([nodeCtx.rebuild(), webCtx.rebuild()]);
    await Promise.all([nodeCtx.dispose(), webCtx.dispose()]);
}
