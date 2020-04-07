const axios = require('axios');
const _ = require('lodash');
const WishlistItem = require('../models/wishlistItem.js');
const telegram = require('../helpers/telegram')

function filter(wishlistItems, item) {
  var predicate = false;
  wishlistItems.forEach(wishlistItem => {
    predicate = predicate || (item.appid == wishlistItem.appid && item.market_name == wishlistItem.name && item.market_value <= wishlistItem.max_price);
  });
  return predicate;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

exports.withdraw = async () => {
  var itemsPromise = axios.get('https://csgoempire.gg/api/v2/hermes/inventory/10');
  var wishlistItemsPromise = WishlistItem.find();
  var promiseResults = await Promise.all([itemsPromise, wishlistItemsPromise]);
  var items = promiseResults[0];
  var wishlistItems = promiseResults[1];

  var wantedItems = _.filter(items.data, item => filter(wishlistItems, item));
  telegram.sendMessage(`${wantedItems.length} items found.`)
  await sleep(2000);
  this.withdraw();
};
