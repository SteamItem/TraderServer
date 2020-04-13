"use strict";
var Withdraw = require("../models/withdraw");
function create(ib) {
    var withdraw = new Withdraw.default({
        bot_id: ib.bot_id,
        market_name: ib.market_name,
        market_value: ib.market_value,
        max_price: ib.max_price,
        store_item_id: ib.store_item_id,
        wishlist_item_id: ib.wishlist_item_id
    });
    return withdraw.save();
}
module.exports = {
    create: create
};
