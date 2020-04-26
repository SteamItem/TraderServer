"use strict";
var mongoose = require("mongoose");
var config = require("../config");
function connect() {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.DB_URL, {
        useNewUrlParser: true
    }).then(function () {
        console.log("Successfully connected to the database");
    }).catch(function (err) {
        console.log('Could not connect to the database. Exiting now...', err);
        process.exit();
    });
}
module.exports = {
    connect: connect
};
