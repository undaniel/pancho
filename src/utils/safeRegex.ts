import * as fs from 'fs';
import * as path from 'path';
import { Worker } from 'worker_threads';
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

let workerPath: string | null | undefined;
const idle: Worker[] = [];
const active = new Set<Worker>();

function resolveWorkerPath(): string | null {
    if (workerPath !== undefined) return workerPath;
    const candidates = [
        path.join(__dirname, 'workers', 'regexWorker.js'),
        path.join(__dirname, '..', 'workers', 'regexWorker.js'),
    ];
    workerPath = candidates.find(p => {
        try {
            return fs.existsSync(p);
        } catch {
            return false;
        }
    }) ?? null;
    return workerPath;
}

function acquireWorker(workerFile: string): Worker {
    const worker = idle.pop() ?? new Worker(workerFile);
    worker.ref();
    return worker;
}

function retireWorker(worker: Worker): void {
    active.delete(worker);
    worker.removeAllListeners();
    void worker.terminate();
}

function parkWorker(worker: Worker): void {
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

    const workerFile = options.workerFile ?? resolveWorkerPath();
    if (!workerFile) return Promise.resolve(executeRegexJob(job));

    return new Promise<RegexJobResult>(resolve => {
        const worker = acquireWorker(workerFile);
        active.add(worker);

        let settled = false;
        let timer: NodeJS.Timeout | undefined;

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

        worker.on('message', (message: RegexJobResult) => settle(message, true));
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
