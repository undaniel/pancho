import { parentPort } from 'worker_threads';
import { executeRegexJob, RegexJob } from '../utils/regexCore';

interface WorkerJob extends RegexJob {
    id: number;
}

if (parentPort) {
    parentPort.on('message', (job: WorkerJob) => {
        const { id, ...regexJob } = job;
        parentPort!.postMessage({ id, ...executeRegexJob(regexJob) });
    });
}
