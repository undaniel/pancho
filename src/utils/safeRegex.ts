import { executeRegexJob, RegexJob, RegexJobResult, isPotentiallyCatastrophic } from './regexCore';

export { isPotentiallyCatastrophic } from './regexCore';
export type { RegexJob, RegexJobResult, RegexMatch } from './regexCore';

const DEFAULT_TIMEOUT_MS = 2000;
const MAX_IDLE_WORKERS = 1;

export interface RegexRunOptions {
    timeoutMs?: number;
    /** Aborting terminates the worker, cancelling the in-flight evaluation. */
    signal?: AbortSignal;
    /** Override the worker script (used by tests). */
    workerFile?: string;
}

interface WorkerInstance {
    ref(): void;
    unref(): void;
    removeAllListeners(): void;
    terminate(): void | Promise<number>;
    on(event: 'message', listener: (message: RegexJobResult) => void): void;
    on(event: 'error' | 'exit', listener: () => void): void;
    postMessage(message: RegexJob): void;
}

type WorkerConstructor = new (file: string) => WorkerInstance;

/**
 * `worker_threads` is only available on Node. On the web we fall back to running
 * the job in-process (the catastrophic-pattern guard still applies). The lazy
 * `require` keeps the web bundle free of Node built-ins.
 */
function loadWorkerConstructor(): WorkerConstructor | null {
    try {
        return (require('node:worker_threads') as { Worker: WorkerConstructor }).Worker;
    } catch {
        return null;
    }
}

let workerPath: string | null | undefined;
const idle: WorkerInstance[] = [];
const active = new Set<WorkerInstance>();

function resolveWorkerPath(): string | null {
    if (workerPath !== undefined) return workerPath;
    try {
        const fs = require('fs') as typeof import('fs');
        const path = require('path') as typeof import('path');
        const candidates = [
            path.join(__dirname, 'workers', 'regexWorker.js'),
            path.join(__dirname, '..', 'workers', 'regexWorker.js'),
        ];
        workerPath = candidates.find(candidate => fs.existsSync(candidate)) ?? null;
    } catch {
        workerPath = null;
    }
    return workerPath;
}

function acquireWorker(WorkerCtor: WorkerConstructor, workerFile: string): WorkerInstance {
    const worker = idle.pop() ?? new WorkerCtor(workerFile);
    worker.ref();
    return worker;
}

function retireWorker(worker: WorkerInstance): void {
    active.delete(worker);
    worker.removeAllListeners();
    void worker.terminate();
}

function parkWorker(worker: WorkerInstance): void {
    active.delete(worker);
    worker.removeAllListeners();
    if (idle.length >= MAX_IDLE_WORKERS) {
        void worker.terminate();
        return;
    }
    worker.on('exit', () => {
        const index = idle.indexOf(worker);
        if (index !== -1) idle.splice(index, 1);
    });
    worker.unref();
    idle.push(worker);
}

export function runRegexJob(job: RegexJob, options: RegexRunOptions = {}): Promise<RegexJobResult> {
    const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const signal = options.signal;

    if (!job.pattern) return Promise.resolve({ error: 'empty' });
    if (isPotentiallyCatastrophic(job.pattern)) return Promise.resolve({ error: 'complex' });
    if (signal?.aborted) return Promise.resolve({ error: 'cancelled' });

    const WorkerCtor = loadWorkerConstructor();
    if (!WorkerCtor) return Promise.resolve(executeRegexJob(job));

    const workerFile = options.workerFile ?? resolveWorkerPath();
    if (!workerFile) return Promise.resolve(executeRegexJob(job));

    return new Promise<RegexJobResult>(resolve => {
        const worker = acquireWorker(WorkerCtor, workerFile);
        active.add(worker);

        let settled = false;
        let timer: ReturnType<typeof setTimeout> | undefined;

        function settle(result: RegexJobResult, reusable: boolean): void {
            if (settled) return;
            settled = true;
            if (timer) clearTimeout(timer);
            signal?.removeEventListener('abort', onAbort);
            if (reusable) parkWorker(worker);
            else retireWorker(worker);
            resolve(result);
        }

        function onAbort(): void {
            settle({ error: 'cancelled' }, false);
        }

        worker.on('message', message => settle(message, true));
        worker.on('error', () => settle({ error: 'exec' }, false));
        worker.on('exit', () => settle({ error: 'exec' }, false));

        timer = setTimeout(() => settle({ error: 'timeout' }, false), Math.max(50, timeoutMs));
        signal?.addEventListener('abort', onAbort, { once: true });

        worker.postMessage(job);
    });
}

export function disposeRegexWorker(): void {
    for (const worker of active) {
        worker.removeAllListeners();
        void worker.terminate();
    }
    active.clear();
    while (idle.length) {
        const worker = idle.pop()!;
        worker.removeAllListeners();
        void worker.terminate();
    }
}
