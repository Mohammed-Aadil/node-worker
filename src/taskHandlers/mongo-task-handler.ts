/**
 * Class contains methods and signature to find type of tasks and call appropriate worker for them
 */
import * as Promise from 'bluebird';
import { Task } from './../models/Task/tasks'
import * as taskConstants from './../models/Task/constants';
import * as _ from 'underscore';
import * as moment from 'moment';
import { Moment } from 'moment';

/**
 * @class TaskHandler
 * @param {dbInstance} mongo 
 */
export class TaskHandler {
    mongo: any;
    constructor(mongo:any) {
        console.log('TaskHandler', 'inside task handler');
        this.mongo = mongo;
    }
    /**
      *
      * @param {dbInstance} mongo
      */
    taskResolver() {
        var _task, self = this, nowTime: Moment;
        console.log('TaskHandler', 'taskResolver', 'inside task resolver');
        /**
         * It will find open and retry tasks and update them to submitted
         * call appropriate worker script wrt to workerType
         */
        return Promise.resolve(Task.findOneAndUpdate({ status: { $in: [taskConstants.STATUS.QUEUED, taskConstants.STATUS.RETRY] } }, { status: taskConstants.STATUS.RUNNING }))
            .then(function (task) {
                nowTime = moment();
                if (task) {
                    _task = task;
                    // checking if retry task is valid and ready to run
                    if (task.retryInterval &&
                        moment(task.updatedAt).add(task.retryInterval, 'seconds').isAfter(nowTime)) {
                        console.log('TaskHandler', 'taskResolver', 'canceling task ' + task.id);
                        return Promise.reject('Task is still pending will try after ' + moment(task.updatedAt).add(task.retryInterval, 'seconds').diff(moment(), 'seconds'));
                    }                        
                    console.log('TaskHandler', 'taskResolver', 'inside then', JSON.stringify(task));
                    return require(process.env.APP_ROOT_PATH + '/dist/' + task.workerName + '/' + task.workerType)(task.args);
                }
                return Promise.reject('No open/retry task found.');
            })
            .then(function (response) {
                console.log('TaskHandler', 'taskResolver', 'task response', response);
                return Task.update({ _id: _task._id }, { status: taskConstants.STATUS.FINISHED });
            })
            .catch(function (err) {
                console.error('TaskHandler', 'taskResolver', 'inside catch', err);
                if (_task) {
                    // if retry interval is given then increase it exponentially
                    if (_task.retryInterval > 0)
                        return _task.updateRetry(nowTime);
                    return Task.update({ _id: _task._id }, { status: taskConstants.STATUS.FAIL });
                }
                return Promise.reject(err);
            })
            .finally(function () {
                console.log('TaskHandler', 'taskResolver', 'closing the connection.');
                self.mongo.close();
            });
    }
};
