import _ = require('lodash');
import { IItemToBuy } from "../interfaces/itemToBuy";
import { IWishlistItem } from '../models/wishlistItem';
import { IInstantStoreItem } from "../interfaces/instantStoreItem";

function generateItemsToBuy(storeItems: IInstantStoreItem[], wishlistItems: IWishlistItem[]) {
  var itemsToBuy: IItemToBuy[] = [];
  wishlistItems.forEach(wi => {
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

function filterForWishlistItem(storeItems: IInstantStoreItem[], wi: IWishlistItem) {
  return _.filter(storeItems, i => { return i.market_name === wi.name && i.appid == wi.appid && i.market_value <= wi.max_price; });
}

function sortForCheapestItem(filteredItems: IInstantStoreItem[]) {
  return _.sortBy(filteredItems, i => { return i.market_value; });
}

function sortForMaxMargin(itemsToBuy: IItemToBuy[]) {
  return _.sortBy(itemsToBuy, i => { return i.market_value - i.max_price; });
}

export = {
  generateItemsToBuy
}