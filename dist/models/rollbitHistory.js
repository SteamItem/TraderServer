"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var RollbitHistorySchema = new mongoose.Schema({
    ref: { type: String },
    price: { type: Number },
    markup: { type: Number },
    name: { type: String },
    weapon: { type: String },
    skin: { type: String },
    rarity: { type: String },
    exterior: { type: String },
    baseprice: { type: String },
    created_at: { type: Date, default: Date.now }
});
exports.default = mongoose.model('RollbitHistory', RollbitHistorySchema);
