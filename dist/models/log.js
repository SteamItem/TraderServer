"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var LogSchema = new mongoose.Schema({
    site: { type: String },
    message: { type: String },
    created_at: { type: Date, default: Date.now }
});
exports.default = mongoose.model('Log', LogSchema);
