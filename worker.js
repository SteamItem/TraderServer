// Configuring the database
const config = require('./config');
const mongoose = require('mongoose');
const workerController = require('./app/controllers/worker');
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(config.dbUrl, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

workerController.withdraw();