import mongoose = require('mongoose');
import config = require('./config');
import workerController = require('./controllers/worker');
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(config.DB_URL, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

var worker = new workerController.Worker();
worker.work();