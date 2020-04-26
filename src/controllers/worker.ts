import axios from 'axios';
import _ = require('lodash');
import wishlistItemController = require('./wishlistItem');
import paramController = require('./param');
import csgoController = require('./csgo');
import withdrawController = require('./withdraw');
import logController = require('./log');
import helpers = require('../helpers');
import { IWishlistItem } from '../models/wishlistItem';
import { IInstantStoreItem } from '../interfaces/instantStoreItem';
import { IItemToBuy } from '../interfaces/itemToBuy';
import workerHelper = require('../helpers/worker');
import { siteEnum } from '../helpers/enum';
import TelegramBot = require('node-telegram-bot-api');
import telegram = require('../helpers/telegram');
import config = require('../config');

export class Worker {
  constructor() {
    this.bot = telegram.getBot();
  }

  private bot: TelegramBot;

  private storeItems: IInstantStoreItem[];
  private itemsToBuy: IItemToBuy[] = [];

  private cookie: string;
  private async getCookie() {
    var cookieParam = await paramController.getCookie();
    if (!cookieParam) throw new Error("Cookie not found");
    return cookieParam.value.toString();
  }

  private period: number;
  private async getPeriod() {
    var periodParam = await paramController.getPeriod();
    if (!periodParam) throw new Error("Period not found");
    var period = Number(periodParam.value);
    if (!period) throw new Error("Period is invalid");
    return period;
  }

  private workerStatus: boolean;
  private async getWorkerStatus() {
    var workerStatusParam = await paramController.getWorkerStatus();
    if (!workerStatusParam) throw new Error("Worker status not found");
    var workerStatus = Boolean(workerStatusParam.value);
    return workerStatus;
  }

  private wishlistItems: IWishlistItem[];
  private async getWishlistItems() {
    return await wishlistItemController.findAll();
  }

  private token: string;
  private async getToken() {
    var token = await csgoController.getToken();
    this.token = token.token.toString();
  }

  private get requestConfig() {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': this.cookie,
        'Host': 'csgoempire.gg'
      }
    };
  }

  /**
   * work
   */
  public async work() {
    var that = this;
    try {
      await that.prepare();
      if (that.workerStatus === true) {
        var tokenPromise = that.getToken();
        var itemPromise = that.getItems();
        await Promise.all([tokenPromise, itemPromise]);
        that.itemsToBuy = workerHelper.generateItemsToBuy(that.storeItems, that.wishlistItems);
        await that.tryToWithdrawAll();
        await helpers.sleep(that.period);
      } else {
        await helpers.sleep(1000);
      }
    } catch (e) {
      that.handleError(e.message);
      await helpers.sleep(1000);
    } finally {
      that.work();
    }
  }

  private async prepare() {
    var cookiePromise = this.getCookie();
    var periodPromise = this.getPeriod();
    var wishlistItemsPromise = this.getWishlistItems();
    var workerStatusPromise = this.getWorkerStatus();

    var promiseResults = await Promise.all([cookiePromise, periodPromise, wishlistItemsPromise, workerStatusPromise]);

    this.cookie = promiseResults[0];
    this.period = promiseResults[1];
    this.wishlistItems = promiseResults[2];
    this.workerStatus = Boolean(promiseResults[3]);
  }

  private async getItems() {
    var that = this;
    try {
      var items = await axios.get('https://csgoempire.gg/api/v2/p2p/inventory/instant', this.requestConfig);
      this.storeItems = items.data;
    } catch (e) {
      that.handleError(JSON.stringify(e.response.data));
      return false;
    }
  }

  private async tryToWithdrawAll() {
    var promises: Promise<boolean>[] = []
    this.itemsToBuy.forEach(ib => promises.push(this.tryToWithdraw(ib)));
    return await Promise.all(promises);
  }

  private async tryToWithdraw(ib: IItemToBuy) {
    var that = this;
    try {
      await that.withdraw(ib.bot_id, ib.store_item_id);
      that.handleSuccessWithdraw(ib);
      return true;
    } catch (e) {
      that.handleError(JSON.stringify(e.response.data));
      return false;
    }
  }

  private async withdraw(bot_id: number, item_id: string) {
    let data = JSON.stringify({
      "security_token": this.token,
      "bot_id": bot_id,
      "item_ids": [item_id]
    });
    var result = await axios.post('https://csgoempire.gg/api/v2/trade/withdraw', data, this.requestConfig);
    return result.data;
  }

  private handleSuccessWithdraw(ib: IItemToBuy) {
    var message = `${ib.market_name} bought for ${ib.market_value / 100}$ which is below ${ib.max_price / 100}$`;
    this.log(message);
    return withdrawController.create(ib);
  }

  private handleError(message: string) {
    this.log(`Error: ${message}`)
  }

  private log(message: string) {
    this.bot.sendMessage(config.TELEGRAM_CHAT_ID, `CSGO: ${message}`);
    return logController.create(siteEnum.CsGoEmpire, message);
  }
}
