import axios from 'axios';
import _ = require('lodash');
import paramController = require('./botParam');
import csgoController = require('./csgo');
import withdrawController = require('./withdraw');
import helpers = require('../helpers');
import { IWishlistItem } from '../models/wishlistItem';
import { IInstantStoreItem, ICsGoTraderStoreItem, IDotaStoreItem } from '../interfaces/instantStoreItem';
import { IItemToBuy } from '../interfaces/itemToBuy';
import workerHelper = require('../helpers/worker');
import { siteEnum, botEnum, botText, siteText } from '../helpers/enum';
import { IBotParam } from '../models/botParam';
import WishlistItem = require('../models/wishlistItem');

abstract class LoggerBase {
  constructor(site: string, bot: string) {
    this.site = site;
    this.bot = bot;
  }

  protected site: string;
  protected bot: string;

  protected handleError(message: string) {
    this.log(`Error: ${message}`)
  }

  abstract log(message: string): void;
}

abstract class WorkerTask {
  constructor(logger: LoggerBase) {
    this.logger = logger;
  }

  protected logger: LoggerBase;
  abstract taskName: string;
  abstract taskWaitTime: number;

  async start() {
    try {
      // var d1 = new Date();
      await this.task();
      // var d2 = new Date();
      // console.log(`${this.taskName} task completed in ${d2.getTime()-d1.getTime()} ms`);
    } catch (e) {
      this.logger.log(`${this.taskName} has error: ${e.message}`);
    } finally {
      await helpers.sleep(this.taskWaitTime);
      await this.start();
    }
  }

  abstract task(): Promise<any>;
}

abstract class MongoSelectorTask extends WorkerTask {
  abstract botId: botEnum;
  public botParam: IBotParam;
  taskName = "Mongo Selector";
  taskWaitTime = 1000;
  private async getBotParam() {
    var botParam = await paramController.getBotParam(this.botId);
    this.botParam = botParam;
  }

  public wishlistItems: IWishlistItem[];
  abstract getWishlistItems(): Promise<IWishlistItem[]>;

  task() {
    var botParamPromise = this.getBotParam();
    var wishlistItemsPromise = this.getWishlistItems();

    return Promise.all([botParamPromise, wishlistItemsPromise]);
  }
}

class TokenGetterTask extends WorkerTask {
  public botParam: IBotParam;
  taskWaitTime = 1000;
  taskName = "Token Getter";

  task(): Promise<void> {
    return this.getToken();
  }

  public token: string;
  private async getToken() {
    if (!this.botParam.worker) return;
    var code = this.botParam.code;
    if (!code) throw new Error("Code not found");
    var token = await csgoController.getToken(code, this.botParam.cookie);
    console.log("token: " + token);
    this.token = token.token.toString();
  }
}

abstract class InventoryGetterTask<T extends ICsGoTraderStoreItem> extends WorkerTask {
  abstract inventoryUrl: string;
  public storeItems: T[];
  public botParam: IBotParam;
  public itemsToBuy: IItemToBuy[] = [];
  public wishlistItems: IWishlistItem[];
  // TODO: Construct edilemediği için static verildi
  taskWaitTime = 1000;
  // taskWaitTime = this.botParam.period;
  taskName = "Inventory Getter";

  private get requestConfig() {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': this.botParam.cookie,
        'Host': 'csgoempire.gg'
      }
    };
  }

  async task() {
    var that = this;
    console.log("inventory getter status: " + that.botParam.worker);
    if (!that.botParam.worker) return;
    console.log("inventory url: " + that.inventoryUrl);
    console.log("requestConfig: " + that.requestConfig);
    var items = await axios.get(that.inventoryUrl, that.requestConfig);
    that.storeItems = items.data;
    that.itemsToBuy = workerHelper.generateItemsToBuy(that.storeItems, that.wishlistItems);
  }
}

class InstantInventoryGetterTask extends InventoryGetterTask<IInstantStoreItem> {
  inventoryUrl = "https://csgoempire.gg/api/v2/p2p/inventory/instant";
}

class DotaInventoryGetterTask extends InventoryGetterTask<IDotaStoreItem> {
  inventoryUrl = "https://csgoempire.gg/api/v2/inventory/site/10";
}

class WithdrawMakerTask extends WorkerTask {
  public itemsToBuy: IItemToBuy[];
  public token: string;
  public botParam: IBotParam;
  // TODO: Construct edilemediği için static verildi
  taskWaitTime = 1000;
  // taskWaitTime = this.botParam.period;
  taskName = "Withdraw Maker"

  private get requestConfig() {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': this.botParam.cookie,
        'Host': 'csgoempire.gg'
      }
    };
  }

  async task() {
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
      that.logger.log(JSON.stringify(e.response.data));
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
    this.logger.log(message);
    return withdrawController.create(ib);
  }
}

abstract class Worker<T extends ICsGoTraderStoreItem> {
  /**
   *
   */
  constructor(logger: LoggerBase, mongoSelector: MongoSelectorTask, tokenGetter: TokenGetterTask, inventoryGetter: InventoryGetterTask<T>, withdrawMaker: WithdrawMakerTask) {
    this.logger = logger;
    this.mongoSelector = mongoSelector;
    this.tokenGetter = tokenGetter;
    this.inventoryGetter = inventoryGetter;
    this.withdrawMaker = withdrawMaker
  }

  private logger: LoggerBase;
  private mongoSelector: MongoSelectorTask;
  private tokenGetter: TokenGetterTask;
  private inventoryGetter: InventoryGetterTask<T>;
  private withdrawMaker: WithdrawMakerTask;

  /**
   * work
   */
  public work() {
    this.mongoSelector.start();
    this.tokenGetter.start();
    this.inventoryGetter.start();
    this.withdrawMaker.start();

    this.sync();
  }

  private sync() {
    try {
      this.tokenGetter.botParam = this.mongoSelector.botParam;
      this.inventoryGetter.botParam = this.mongoSelector.botParam;
      this.inventoryGetter.wishlistItems = this.mongoSelector.wishlistItems;
      this.withdrawMaker.token = this.tokenGetter.token;
      this.withdrawMaker.botParam = this.mongoSelector.botParam;
      this.withdrawMaker.itemsToBuy = this.inventoryGetter.itemsToBuy;
    } catch (e) {
      this.logger.log(e.message);
    } finally {
      this.sync();
    }
  }
}

class InstantWorker extends Worker<IInstantStoreItem> {
}

class DotaWorker extends Worker<IDotaStoreItem> {
}

class ConsoleLogger extends LoggerBase {
  log(message: string) {
    console.log(message);
  }
}

class InstantMongoSelector extends MongoSelectorTask {
  botId = botEnum.CsGoInstant;

  async getWishlistItems(): Promise<IWishlistItem[]> {
    return WishlistItem.default.find({appid: 730});
  }
}

class DotaMongoSelector extends MongoSelectorTask {
  botId = botEnum.CsGoDota;

  async getWishlistItems(): Promise<IWishlistItem[]> {
    return WishlistItem.default.find({appid: 570});
  }
}

export function instantWorker(): InstantWorker {
  var siteName = siteText(siteEnum.CsGoEmpire)
  var botName = botText(botEnum.CsGoInstant);
  var logger = new ConsoleLogger(siteName, botName);
  var mongoSelector = new InstantMongoSelector(logger);
  var tokenGetter = new TokenGetterTask(logger);
  var inventoryGetter = new InstantInventoryGetterTask(logger);
  var withdrawMaker = new WithdrawMakerTask(logger);
  return new InstantWorker(logger, mongoSelector, tokenGetter, inventoryGetter, withdrawMaker);
}

export function dotaWorker(): DotaWorker {
  var siteName = siteText(siteEnum.CsGoEmpire)
  var botName = botText(botEnum.CsGoDota);
  var logger = new ConsoleLogger(siteName, botName);
  var mongoSelector = new DotaMongoSelector(logger);
  var tokenGetter = new TokenGetterTask(logger);
  var inventoryGetter = new DotaInventoryGetterTask(logger);
  var withdrawMaker = new WithdrawMakerTask(logger);
  return new DotaWorker(logger, mongoSelector, tokenGetter, inventoryGetter, withdrawMaker);
}
