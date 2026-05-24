import * as path from 'path';
import { runTests } from '@vscode/test-cli';

async function main() {
    const extensionPath = path.resolve(__dirname, '..', '..');

    await runTests({
        extensionDevelopmentPath: extensionPath,
        extensionTestsPath: path.resolve(__dirname),
        launchArgs: [
            path.resolve(__dirname, 'workspaces', 'small'),
        ],
    });
}

main().catch(err => {
    console.error('Failed to run integration tests:', err);
    process.exit(1);
});