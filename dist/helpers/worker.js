"use strict";
var _ = require("lodash");
function generateItemsToBuy(storeItems, wishlistItems) {
    var itemsToBuy = [];
    wishlistItems.forEach(function (wi) {
        var filteredItems = filterForWishlistItem(storeItems, wi);
        var sortedItems = sortForCheapestItem(filteredItems);
        if (sortedItems.length > 0) {
            var bestOffer = sortedItems[0];
            itemsToBuy.push({
                bot_id: bestOffer.bot_id,
                market_name: bestOffer.market_name,
                market_value: bestOffer.market_value,
                max_price: wi.max_price,
                store_item_id: bestOffer.id,
                wishlist_item_id: wi._id
            });
        }
    });
    var sortedItemsToBuy = sortForMaxMargin(itemsToBuy);
    return sortedItemsToBuy;
}
function filterForWishlistItem(storeItems, wi) {
    return _.filter(storeItems, function (i) { return i.market_name === wi.name && i.appid == wi.appid && i.market_value <= wi.max_price; });
}
function sortForCheapestItem(filteredItems) {
    return _.sortBy(filteredItems, function (i) { return i.market_value; });
}
function sortForMaxMargin(itemsToBuy) {
    return _.sortBy(itemsToBuy, function (i) { return i.market_value - i.max_price; });
}
module.exports = {
    generateItemsToBuy: generateItemsToBuy
};
