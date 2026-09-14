type Disposable = { dispose: () => void };

export class Position {
    constructor(public line: number, public character: number) {}
    isEqual(other: Position): boolean {
        return this.line === other.line && this.character === other.character;
    }
    isBefore(other: Position): boolean {
        return this.line < other.line || (this.line === other.line && this.character < other.character);
    }
    translate(): Position {
        return this;
    }
}

export class Range {
    start: Position;
    end: Position;
    constructor(a: Position | number, b: Position | number, c?: number, d?: number) {
        if (typeof a === 'number') {
            this.start = new Position(a, c ?? 0);
            this.end = new Position(b as number, d ?? 0);
        } else {
            this.start = a;
            this.end = b as Position;
        }
    }
    get isEmpty(): boolean {
        return this.start.isEqual(this.end);
    }
}

export class Selection extends Range {
    anchor: Position;
    active: Position;
    constructor(a: Position | number, b: Position | number, c?: Position | number, d?: Position | number) {
        if (typeof a === 'number') {
            super(a, b as number, c as number, d as number);
            this.anchor = this.start;
            this.active = this.end;
        } else {
            super(a, b as Position);
            this.anchor = a;
            this.active = b as Position;
        }
    }
}

export class WorkspaceEdit {
    replace(): void {}
    insert(): void {}
    delete(): void {}
}

export const ProgressLocation = { Notification: 15, Window: 10, SourceControl: 1 };

export const StatusBarAlignment = { Left: 1, Right: 2 };

export class EventEmitter<T> {
    private listeners: ((e: T) => void)[] = [];
    event = (listener: (e: T) => void): Disposable => {
        this.listeners.push(listener);
        return { dispose: () => {} };
    };
    fire(value: T): void {
        this.listeners.forEach(l => l(value));
    }
    dispose(): void {
        this.listeners = [];
    }
}

const configValues: Record<string, unknown> = {};

function substitute(message: string, args: unknown[]): string {
    if (!args.length) return message;
    return message.replace(/\{(\d+)\}/g, (_, i) => String(args[Number(i)] ?? ''));
}

export const l10n = {
    t: (message: string, ...args: unknown[]): string => substitute(message, args),
};

export const window = {
    activeTextEditor: undefined as unknown,
    showWarningMessage: jest.fn(),
    showErrorMessage: jest.fn(),
    showInformationMessage: jest.fn(),
    showInputBox: jest.fn(async () => undefined),
    showQuickPick: jest.fn(async () => undefined),
    withProgress: jest.fn(async (_opts: unknown, task: (...args: unknown[]) => unknown) => task({ report: () => {} }, { isCancellationRequested: false, onCancellationRequested: () => ({ dispose: () => {} }) })),
    createOutputChannel: jest.fn(() => ({ clear: () => {}, appendLine: () => {}, show: () => {}, dispose: () => {} })),
    createStatusBarItem: jest.fn(() => ({ text: '', tooltip: '', command: '', show: () => {}, hide: () => {}, dispose: () => {} })),
};

function getConfiguration(): { get: <T>(key: string, def: T) => T } {
    return {
        get: <T>(key: string, def: T): T => (key in configValues ? (configValues[key] as T) : def),
    };
}

export const workspace = {
    isTrusted: true,
    getConfiguration,
    onDidChangeConfiguration: jest.fn(() => ({ dispose: () => {} })),
    onDidChangeTextDocument: jest.fn(() => ({ dispose: () => {} })),
    onDidChangeTextEditorSelection: jest.fn(() => ({ dispose: () => {} })),
    findFiles: jest.fn(async () => []),
    openTextDocument: jest.fn(),
    applyEdit: jest.fn(async () => true),
    registerTextDocumentContentProvider: jest.fn(() => ({ dispose: () => {} })),
    fs: {
        writeFile: jest.fn(async () => {}),
    },
};

export const env = {
    language: 'en',
    clipboard: {
        readText: jest.fn(async () => ''),
        writeText: jest.fn(async () => {}),
    },
};

export const extensions = {
    getExtension: jest.fn(() => undefined),
    all: [] as unknown[],
};

const commandHandlers = new Map<string, (...args: unknown[]) => unknown>();

export const commands = {
    registerCommand: jest.fn((id: string, handler: (...args: unknown[]) => unknown): Disposable => {
        commandHandlers.set(id, handler);
        return { dispose: () => commandHandlers.delete(id) };
    }),
    executeCommand: jest.fn(async () => undefined),
};

export function __getCommandHandler(id: string): ((...args: unknown[]) => unknown) | undefined {
    return commandHandlers.get(id);
}

export function __reset(): void {
    commandHandlers.clear();
    for (const k of Object.keys(configValues)) delete configValues[k];
    window.activeTextEditor = undefined;
    (window.showWarningMessage as jest.Mock).mockClear();
    (window.showErrorMessage as jest.Mock).mockClear();
    (window.showInformationMessage as jest.Mock).mockClear();
    commands.registerCommand.mockClear();
}

export function __setConfig(key: string, value: unknown): void {
    configValues[key] = value;
}

export class Uri {
    private constructor(public readonly value: string) {}
    static file(p: string): Uri {
        return new Uri(p);
    }
    static parse(value: string): Uri {
        return new Uri(value);
    }
    get fsPath(): string {
        return this.value;
    }
    toString(): string {
        return this.value;
    }
}
