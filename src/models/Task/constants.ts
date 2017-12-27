import { WorkerConfig } from './../../config';

let config = new WorkerConfig().getTaskConfig();

const constants = {
    WORKER_NAME: config.workerNameObject || {
        MY_WORKER: 'myWorker'
    },
    WORKER_TYPE: config.workerTypeObject || {
        HELLO_WORLD: 'hello_world'
    },
    STATUS: config.workerStatusObject || {
        QUEUED: 'queued',
        FINISHED: 'finished',
        FAIL: 'fail',
        RETRY: 'retry',
        RUNNING: 'running'
    },
    DEFAULT: config.workerDefault || {
        RETRY_INTERVAL: 0,
        MAX_RETRY: 8,
        STATUS: 'queued'
    }
};

export = constants;
