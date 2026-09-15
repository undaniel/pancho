import * as esbuild from 'esbuild';
import { rmSync } from 'fs';

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

// esbuild does not remove files from previous builds (e.g. a stale `tsc`
// compile). Start from a clean output directory so the package never ships
// dead code.
rmSync('dist', { recursive: true, force: true });

const ctx = await esbuild.context({
    entryPoints: ['src/extension.ts', 'src/workers/regexWorker.ts'],
    bundle: true,
    format: 'cjs',
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: 'node',
    outdir: 'dist',
    outbase: 'src',
    external: ['vscode'],
    logLevel: 'info',
});

if (watch) {
    await ctx.watch();
    console.log('Watching for changes...');
} else {
    await ctx.rebuild();
    await ctx.dispose();
}
