"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var WishlistItemSchema = new mongoose.Schema({
    appid: { type: Number, required: true },
    name: { type: String, required: true },
    max_price: { type: Number, required: true }
});
exports.default = mongoose.model('WishlistItem', WishlistItemSchema);
