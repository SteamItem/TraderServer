import axios from 'axios';
import _ = require('lodash');
import wishlistItemController = require('./wishlistItem');
import paramController = require('./botParam');
import csgoController = require('./csgo');
import withdrawController = require('./withdraw');
import logController = require('./log');
import helpers = require('../helpers');
import { IWishlistItem } from '../models/wishlistItem';
import { IInstantStoreItem, ICsGoTraderStoreItem, IDotaStoreItem } from '../interfaces/instantStoreItem';
import { IItemToBuy } from '../interfaces/itemToBuy';
import workerHelper = require('../helpers/worker');
import { siteEnum, botEnum } from '../helpers/enum';
import { IBotParam } from '../models/botParam';
import WishlistItem = require('../models/wishlistItem');

abstract class CsGoTraderWorker<T extends ICsGoTraderStoreItem> {
  abstract inventoryUrl: string;
  abstract appid: number;
  abstract botId: botEnum;

  private storeItems: T[];
  private itemsToBuy: IItemToBuy[] = [];

  private botParam: IBotParam;
  private async getBotParam() {
    var botParam = await paramController.getBotParam(this.botId);
    if (!botParam) throw new Error("Bot Param not found");
    return botParam;
  }

  private wishlistItems: IWishlistItem[];
  abstract getWishlistItems(): Promise<IWishlistItem[]>;

  private token: string;
  private async getToken() {
    var token = await csgoController.getToken(this.botId);
    this.token = token.token.toString();
  }

  private get requestConfig() {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': this.botParam.cookie,
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
      if (that.botParam.worker === true) {
        var tokenPromise = that.getToken();
        var itemPromise = that.getItems();
        await Promise.all([tokenPromise, itemPromise]);
        that.itemsToBuy = workerHelper.generateItemsToBuy(that.storeItems, that.wishlistItems);
        await that.tryToWithdrawAll();
        await helpers.sleep(that.botParam.period);
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
    var botParamPromise = this.getBotParam();
    var wishlistItemsPromise = this.getWishlistItems();

    var promiseResults = await Promise.all([botParamPromise, wishlistItemsPromise]);

    this.botParam = promiseResults[0];
    this.wishlistItems = promiseResults[1];
  }

  private async getItems() {
    var that = this;
    try {
      var items = await axios.get(that.inventoryUrl, this.requestConfig);
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
    var message: string;
    if (ib.max_price) {
      message = `${ib.name} bought for ${ib.market_value / 100} coins which is below ${ib.max_price / 100} coins`;
    } else {
      message = `${ib.name} bought for ${ib.market_value / 100} coins without any limit`;
    }
    this.log(message);
    return withdrawController.create(ib);
  }

  private handleError(message: string) {
    this.log(`Error: ${message}`)
  }

  private log(message: string) {
    return logController.create(siteEnum.CsGoEmpire, message);
  }
}

export class CsGoInstantWorker extends CsGoTraderWorker<IInstantStoreItem> {
  inventoryUrl = "https://csgoempire.gg/api/v2/p2p/inventory/instant";
  appid = 730;
  botId = botEnum.CsGoInstant;

  async getWishlistItems() {
    return WishlistItem.default.find({appid: this.appid});
  }
}

export class CsGoDotaWorker extends CsGoTraderWorker<IDotaStoreItem> {
  inventoryUrl = "https://csgoempire.gg/api/v2/inventory/site/10";
  appid = 570;
  botId = botEnum.CsGoDota;

  async getWishlistItems() {
    return WishlistItem.default.find({appid: this.appid});
  }
}