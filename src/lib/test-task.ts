import { Task } from './../models/Task/tasks';
import { Mongoose } from 'mongoose';
import * as Promise from 'bluebird';

export class TestTask {
    task: Mongoose;
    workerName: string;
    workerType: string;
    args: object;
    constructor (workerName: string, workerType: string, args: object) {
        this.workerName = workerName;
        this.workerType = workerType;
        this.args = args;
    }

    getTask () {
        let task = new Task({"workerName": this.workerName, "workerType": this.workerType, "args": this.args, "maxRetryInterval": 8, "retryInterval": 2 });
        console.log('TestTask', 'getTask', 'creating task', task);
        return Promise.resolve(task.save());
    }
}