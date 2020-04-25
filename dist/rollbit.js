"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var config = require("./config");
var rollbitController = require("./controllers/rollbit");
mongoose.Promise = global.Promise;
// Connecting to the database
mongoose.connect(config.DB_URL, {
    useNewUrlParser: true
}).then(function () {
    console.log("Successfully connected to the database");
}).catch(function (err) {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});
var logger = new rollbitController.RollbitLogger();
logger.startLogging();
