import { defineConfig } from '@vscode/test-cli';

// `VSCODE_VERSION` lets CI exercise both the minimum supported engine
// (1.80.0) and the current stable release.
export default defineConfig({
    files: 'dist-tests/tests/integration/**/*.test.js',
    version: process.env.VSCODE_VERSION ?? 'stable',
    workspaceFolder: 'tests/integration/workspaces/small',
    launchArgs: ['--disable-extensions', '--disable-gpu', '--no-sandbox'],
});
