 /**
  * contains all the config to worker project
  * @class WorkerConfig
  */
 export class WorkerConfig {

    /**
     * memberOf WorkerConfig
     * @description Task schema config
     */
    getTaskConfig() {
        return {
            workerNameObject: null,
            workerTypeObject: null,
            workerStatusObject: null,
            workerDefault: null
        };
    }
 }