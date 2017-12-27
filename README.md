# Worker 

It is typescript project designed to work as Worker architecture with mongoDB as queuing system.

## How it work
To understand it we need to understand two concept in this project.

### Task schema
**workerName**: It is name of worker and directory in src folder.

**workerType**: It is type of worker and worker code file name in *workerName* directory. It export module function to run as entry point for worker process.

**args**: It is Object type and it holds arguments to entry function call of worker process.

**retryInterval**: If set then It will retry process in given seconds and increase exponentially with every failed worker process.

**maxRetry**: If *retryInterval* is set then it decides how many time a worker process should run. Default is 8.

**lastRetryDateTime**: It is date time object which hold time of last retry.

**status**: It tell about worker status which are queued (default), finished, fail, retry, running.

### project hierarchy of worker setup
This project have hierarchical requirement for worker setup. In src folder you can create workerName for eg *myWorker* inside this folder you create *workerType* (exported module functions file) for eg hello_world.ts

When you run this project it will look for task with status queued and run the file module with *args* as function parameter on path *APP_ROOT_PATH*/dist/myWorker/hello_world.js 

If it find the file then it run the task else task will set to failed.

## Usage
To run this project simply built docker image and run it.
```
docker build .
docker run IMAGE_ID -d
```

## ENV file
This project have environment variable dependecies.
```
cloudapiSecret=******
cloudapiKey=******
cloudName=******
APP_ROOT_PATH=/apps/lib/workers
MONGO_DB_URL=mongodb://mongodb/workerDB
ES_INDEX=******
ES_SCHEME=http
ES_HOST=localhost
ES_PORT=9200
ES_API_VERSION=2.4
ES_USER=admin
ES_PASS=123456
ES_REQUEST_TIMEOUT=10000
BNEXT_ADMIN_EMAIL=******
BNEXT_ADMIN_PASSWORD=******
BNEXT_SCHEME=http
BNEXT_HOST=192.168.0.33
BNEXT_PORT=3000
```