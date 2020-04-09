import axios from 'axios';
import _ = require('lodash');
import wishlistItemController = require('./wishlistItem');
import paramController = require('./param');
import csgoController = require('./csgo');
import config = require('../config');
import telegram = require('../helpers/telegram');
import { IParam } from '../models/param';
import { IWishlistItem } from '../models/wishlistItem';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function withdraw() {
  try {
    var bot = telegram.getBot();
    var cookieParamPromise = paramController.getCookie();
    var periodParamPromise = paramController.getPeriod();
    var wishlistItemsPromise = wishlistItemController.findAll();
    var tokenPromise = csgoController.getToken();
    var promiseResults = await Promise.all([cookieParamPromise, periodParamPromise, wishlistItemsPromise, tokenPromise]);
    var cookieParam: IParam | null = promiseResults[0];
    var periodParam: IParam | null = promiseResults[1];
    var wishlistItems: IWishlistItem[] = promiseResults[2];
    var token = promiseResults[3];

    if (!cookieParam) throw new Error("Cookie not found");
    if (!periodParam) throw new Error("Period not found");

    var period = Number(periodParam.value);
    if (!period) throw new Error("Period is invalid");

    let content = {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieParam.value,
        'Host': 'csgoempire.gg'
      }
    };
    var items = await axios.get('https://csgoempire.gg/api/v2/p2p/inventory/instant', content);
    // var items = await axios.get('https://csgoempire.gg/api/v2/hermes/inventory/10', content);
    wishlistItems.forEach(async wi => {
      var filteredItems = _.filter(items.data, i => { return i.market_name === wi.name && i.appid == wi.appid && i.market_value <= wi.max_price; });
      var sortedItems = _.sortBy(filteredItems, i => { return i.market_value; });
      if (sortedItems.length > 0) {
        var itemToBuy = sortedItems[0];
        let data = JSON.stringify({
          "security_token": token.token,
          "bot_id": itemToBuy.bot_id,
          "item_ids": [itemToBuy.id]
        });
        try {
          await axios.post('https://csgoempire.gg/api/v2/trade/withdraw', data, content);
          bot.sendMessage(config.telegramChatId, `${itemToBuy.market_name} bought for ${itemToBuy.market_value} which is below ${wi.max_price}`);
          await wishlistItemController.remove(wi._id);
        } catch (e) {
          bot.sendMessage(config.telegramChatId, `Error: ${JSON.stringify(e.response.data)}`);
          await sleep(5000);
        }
      }
    });

    await sleep(period);
  } catch (e) {
    console.log(e);
    await sleep(1000);
    // telegram.sendMessage(`Error: ${e.message}`);
  } finally {
    withdraw();
  }
};

export = {
  withdraw
}