"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var RollbitFavSchema = new mongoose.Schema({
    name: { type: String },
});
exports.default = mongoose.model('RollbitFav', RollbitFavSchema);
