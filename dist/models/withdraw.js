"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var WithdrawSchema = new mongoose.Schema({
    bot_id: { type: Number },
    market_name: { type: String },
    market_value: { type: Number },
    max_price: { type: Number },
    store_item_id: { type: String },
    wishlist_item_id: { type: String },
    created_at: { type: Date, default: Date.now }
});
exports.default = mongoose.model('Withdraw', WithdrawSchema);
