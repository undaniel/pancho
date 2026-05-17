import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.commands.registerCommand('pancho.test.run', async () => {
            const suite = new TextTransformsTestSuite();
            await suite.run();
            vscode.window.showInformationMessage('Pancho: Tests completed!');
        })
    );
}

class TextTransformsTestSuite {
    private passed = 0;
    private failed = 0;

    async run(): Promise<void> {
        this.testCountWords();
        this.testCountCharacters();
        this.testCountLines();
        this.testTrimLines();
        this.testToUpperCase();
        this.testToLowerCase();
        this.testRemoveDuplicateLines();
        this.testSortAscending();
        console.log(`Tests: ${this.passed} passed, ${this.failed} failed`);
    }

    private assert(condition: boolean, message: string): void {
        if (condition) {
            this.passed++;
            console.log(`✓ ${message}`);
        } else {
            this.failed++;
            console.error(`✗ ${message}`);
        }
    }

    private testCountWords(): void {
        this.assert(countWords('hello world') === 2, 'countWords: simple words');
        this.assert(countWords('') === 0, 'countWords: empty string');
        this.assert(countWords('   ') === 0, 'countWords: whitespace only');
        this.assert(countWords('one two three four') === 4, 'countWords: four words');
    }

    private testCountCharacters(): void {
        this.assert(countCharacters('hello') === 5, 'countCharacters: basic');
        this.assert(countCharacters('') === 0, 'countCharacters: empty');
        this.assert(countCharacters('áéíóú') === 5, 'countCharacters: unicode');
    }

    private testCountLines(): void {
        this.assert(countLines('one\ntwo\nthree') === 3, 'countLines: basic');
        this.assert(countLines('') === 1, 'countLines: empty');
        this.assert(countLines('one') === 1, 'countLines: single line');
    }

    private testTrimLines(): void {
        this.assert(trimLines('  hello  \n  world  ') === 'hello\nworld', 'trimLines: basic');
    }

    private testToUpperCase(): void {
        this.assert(toUpper('hello') === 'HELLO', 'toUpperCase: basic');
    }

    private testToLowerCase(): void {
        this.assert(toLower('HELLO') === 'hello', 'toLowerCase: basic');
    }

    private testRemoveDuplicateLines(): void {
        this.assert(removeDuplicateLines('a\nb\na\nc') === 'a\nb\nc', 'removeDuplicateLines');
    }

    private testSortAscending(): void {
        this.assert(sortLinesAscending('c\na\nb') === 'a\nb\nc', 'sortAscending');
    }
}

function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function countCharacters(text: string): number {
    return text.length;
}

function countLines(text: string): number {
    return text.split('\n').length;
}

function trimLines(text: string): string {
    return text.split('\n').map(line => line.trim()).join('\n');
}

function toUpper(text: string): string {
    return text.toUpperCase();
}

function toLower(text: string): string {
    return text.toLowerCase();
}

function removeDuplicateLines(text: string): string {
    return [...new Set(text.split('\n'))].join('\n');
}

function sortLinesAscending(text: string): string {
    return text.split('\n').sort().join('\n');
}