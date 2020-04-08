import axios from 'axios';
import _ = require('lodash');
import WishlistItem = require('../models/wishlistItem');
import paramController = require('./param');

function filter(wishlistItems, item) {
  var predicate = false;
  wishlistItems.forEach(wishlistItem => {
    predicate = predicate || (item.appid == wishlistItem.appid && item.market_name == wishlistItem.name && item.market_value <= wishlistItem.max_price);
  });
  return predicate;
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function withdraw() {
  try {
    var cookieParamPromise = paramController.getCookie();
    var periodParamPromise = paramController.getPeriod();
    var wishlistItemsPromise = WishlistItem.find();
    var promiseResults = await Promise.all([cookieParamPromise, periodParamPromise, wishlistItemsPromise]);
    var cookieParam = promiseResults[0];
    var periodParam = promiseResults[1];
    var wishlistItems = promiseResults[2];

    let content = {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieParam.value,
        'Host': 'csgoempire.gg'
      }
    };
    // var items = await axios.get('https://csgoempire.gg/api/v2/p2p/inventory/instant', content);
    var items = await axios.get('https://csgoempire.gg/api/v2/hermes/inventory/10', content);

    var wantedItems = _.filter(items.data, item => filter(wishlistItems, item));
    console.log(wantedItems);
    // let wantedItems = [];
    // wishlistItems.forEach(wishlistItem => {
    //   var filteredItems = _.filter(items.data, i => { return i.market_name === wishlistItem.name && i.appid == wishlistItem.appid && i.market_value <= wishlistItem.max_price; });
    //   var sortedItems = _.sortBy(filteredItems, i => { return i.market_value; });
    //   if (sortedItems.length > 0) {
    //     var wantedItem = _.head(sortedItems);
    //     wantedItems.push[wantedItem];
    //     console.log(wantedItems);
    //   }
    // });
    // console.log(wantedItems.length);

    if (wantedItems && wantedItems.length > 0) {
      console.log(wantedItems.length);
      // telegram.sendMessage(`${wantedItems.length} items found.`)
    }
    await sleep(periodParam.value);
  } catch (e) {
    console.log(e.message);
    await sleep(5000);
    // telegram.sendMessage(`Error: ${e.message}`);
  } finally {
    this.withdraw();
  }
};

export = {
  withdraw
}