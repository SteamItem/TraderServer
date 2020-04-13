"use strict";
var Log = require("../models/log");
function create(message) {
    var log = new Log.default({ message: message });
    return log.save();
}
module.exports = {
    create: create
};
