"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var ParamSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    value: { type: Object, required: true }
});
exports.default = mongoose.model('Param', ParamSchema);
