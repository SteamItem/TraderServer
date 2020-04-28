import _ = require('lodash');
import { IItemToBuy } from "../interfaces/itemToBuy";
import { IWishlistItem } from '../models/wishlistItem';
import { ICsGoTraderStoreItem } from "../interfaces/instantStoreItem";

function generateItemsToBuy(storeItems: ICsGoTraderStoreItem[], wishlistItems: IWishlistItem[]) {
  var itemsToBuy: IItemToBuy[] = [];
  wishlistItems.forEach(wi => {
    var filteredItems = filterForWishlistItem(storeItems, wi);
    var sortedItems = sortForCheapestItem(filteredItems);
    if (sortedItems.length > 0) {
      var bestOffer = sortedItems[0];
      itemsToBuy.push({
        bot_id: bestOffer.bot_id,
        name: bestOffer.name,
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

function filterForWishlistItem(storeItems: ICsGoTraderStoreItem[], wi: IWishlistItem) {
  return _.filter(storeItems, i => {
    var filterResult = i.name === wi.name && i.appid == wi.appid;
    if (wi.max_price) {
      filterResult = filterResult && i.market_value <= wi.max_price;
    }
    return filterResult;
  });
}

function sortForCheapestItem(filteredItems: ICsGoTraderStoreItem[]) {
  return _.sortBy(filteredItems, i => { return i.market_value; });
}

function sortForMaxMargin(itemsToBuy: IItemToBuy[]) {
  return _.sortBy(itemsToBuy, i => {
    if (i.max_price) {
      return i.market_value - i.max_price;
    } else {
      return 0;
    }
   });
}

export = {
  generateItemsToBuy
}