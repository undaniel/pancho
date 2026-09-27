import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
    files: 'dist-tests/tests/integration/**/*.test.js',
    version: 'stable',
    workspaceFolder: 'tests/integration/workspaces/small',
    launchArgs: ['--disable-extensions', '--disable-gpu', '--no-sandbox'],
});
