/**
 * This file contains Tasks model defination and relation
 */
import * as mongoose from 'mongoose';
import * as constants from './constants';
import * as timestamp from 'mongoose-timestamp';
import { getObjectValues } from './../../utility/functions';
import * as moment from 'moment';
import { Moment } from 'moment';
import * as Promise from 'bluebird';

let Schema = mongoose.Schema;

var TaskSchema = new Schema({
    workerName: {
        type: 'String',
        required: true,
        // validated worker name
        enum: getObjectValues(constants.WORKER_NAME)
    },
    workerType: {
        type: 'String',
        required: true,
        // validated types
        enum: getObjectValues(constants.WORKER_TYPE)
    },
    args: {
        type: 'Object',
        required: true
    },
    // in seconds
    retryInterval: {
        type: 'Number',
        default: constants.DEFAULT.RETRY_INTERVAL
    },
    // in seconds
    maxRetry: {
        type: 'Number',
        default: constants.DEFAULT.MAX_RETRY
    },
    lastRetryDateTime: {
        type: 'Date',
        default: new Date()
    },
    status: {
        type: 'String',
        required: true,
        default: constants.DEFAULT.STATUS,
        // validated status
        enum: getObjectValues(constants.STATUS)
    }
});

TaskSchema.plugin(timestamp);

// adding method to update retry Task
TaskSchema.methods.updateRetry = function (nowTime?: Moment) {
    var obj:{[key: string]: string | number | Moment} = {};
    if (this.retryInterval > 0) {
        if (this.maxRetry <= 0) {
            console.log('Task', 'updateRetry', 'Max retry has been reached of task ' + this.id);
            obj.status = constants.STATUS.FAIL;
        }
        else {
            obj.status = constants.STATUS.RETRY;
            if (moment(this.lastRetryDateTime).add(this.retryInterval, 'seconds').isBefore(nowTime || moment())) {
                console.log('Task', 'updateRetry', 'increasing interval for task ' + this.id + ' to ' + this.retryInterval);
                obj.retryInterval = 2 * this.retryInterval;
            }
            obj.lastRetryDateTime = moment();
            obj.maxRetry = this.maxRetry - 1;
        }
        console.log('task data', this);
        return Task.update({_id: this._id}, obj);
    }
    return Promise.reject('Task is not retryable');
};

/**
 * mongoose model Task
 * @example 
 * new Task({
 *      workerName: 'sellerWorker',
 *       workerType: 'cloudinary_upload',
 *       args: {
 *           orgId: 'org1',
 *           imageType: 'PUBLIC_PRODUCT',
 *           productId:'pro1',
 *           catalogId:'cat1',
 *           modelAttribute1:'coverImage',
 *           imageSequence:'2',
 *           imageUrl: *'http://res.cloudinary.com/bnextdev/image/upload/v1511513968/publicProducts/AV_tJtYZdnoCNyScRBpo/pldybn9zz2xfezkqixh7.jpg'
 *       }
 *   }).save();
 */
export let Task = mongoose.model('Task', TaskSchema);
