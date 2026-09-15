import * as fs from 'fs';
import * as path from 'path';
import { Worker } from 'worker_threads';
import { executeRegexJob, RegexJob, RegexJobResult, isPotentiallyCatastrophic } from './regexCore';

export { isPotentiallyCatastrophic } from './regexCore';
export type { RegexJob, RegexJobResult, RegexMatch } from './regexCore';

const DEFAULT_TIMEOUT_MS = 2000;

interface PendingJob {
    resolve: (result: RegexJobResult) => void;
    timer: NodeJS.Timeout;
}

let worker: Worker | null = null;
let nextId = 1;
let workerPath: string | null | undefined;
const pending = new Map<number, PendingJob>();

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

function ensureWorker(workerFile: string): Worker {
    if (worker) return worker;
    const w = new Worker(workerFile);
    w.on('message', (message: { id: number } & RegexJobResult) => {
        const job = pending.get(message.id);
        if (!job) return;
        clearTimeout(job.timer);
        pending.delete(message.id);
        job.resolve(message);
    });
    w.on('error', () => {
        resetWorker();
        flushPending({ error: 'exec' });
    });
    w.on('exit', () => {
        if (worker === w) worker = null;
    });
    worker = w;
    return w;
}

function resetWorker(): void {
    const w = worker;
    worker = null;
    if (w) {
        w.removeAllListeners();
        void w.terminate();
    }
}

function flushPending(result: RegexJobResult): void {
    for (const [, job] of pending) {
        clearTimeout(job.timer);
        job.resolve(result);
    }
    pending.clear();
}

export async function runRegexJob(job: RegexJob, timeoutMs: number = DEFAULT_TIMEOUT_MS): Promise<RegexJobResult> {
    if (!job.pattern) return { error: 'empty' };
    if (isPotentiallyCatastrophic(job.pattern)) return { error: 'complex' };

    const workerFile = resolveWorkerPath();
    if (!workerFile) {
        return executeRegexJob(job);
    }

    const w = ensureWorker(workerFile);
    const id = nextId++;

    return new Promise<RegexJobResult>(resolve => {
        const timer = setTimeout(() => {
            pending.delete(id);
            resetWorker();
            resolve({ error: 'timeout' });
        }, Math.max(50, timeoutMs));

        pending.set(id, { resolve, timer });
        w.postMessage({ ...job, id });
    });
}

/**
 * Warms up the worker thread so the first user regex does not pay the
 * thread-spawn cost. Safe to call multiple times.
 */
export function prewarmRegexWorker(): void {
    const workerFile = resolveWorkerPath();
    if (!workerFile) return;
    try {
        ensureWorker(workerFile);
    } catch {
        // Prewarming is best-effort; the fallback path still works.
    }
}

export function disposeRegexWorker(): void {
    flushPending({ error: 'exec' });
    resetWorker();
}
