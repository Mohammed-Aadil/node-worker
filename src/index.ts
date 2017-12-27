import * as mongoose from 'mongoose';
import { Task } from './models/Task/tasks';
import { TaskHandler } from  './taskHandlers/mongo-task-handler';
import { TestTask } from './lib/test-task';

mongoose.connect(process.env.MONGO_DB_URL);
// get db connection
let db = mongoose.connection;
// on db error
db.on('error', console.error.bind(console, 'connection error:'));
// on db connection open
db.once('open', function () {
    console.log('Mongo db Connection made');
    new TestTask('myWorker', 'hello_world', {name: 'Earth'})
        .getTask()
        .then(function () {
            new TaskHandler(db).taskResolver();
        });    
    // we're connected!
})

export = { db: db };
