import axios from 'axios';
import cron = require('node-cron');
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

  public botParam: IBotParam;
  protected logger: LoggerBase;
  abstract taskName: string;

  abstract async work(): Promise<any>;
}

abstract class MongoSelectorTask extends WorkerTask {
  abstract botId: botEnum;
  taskName = "Mongo Selector";
  private getBotParam() {
    return paramController.getBotParam(this.botId);
  }

  public wishlistItems: IWishlistItem[];
  abstract getWishlistItems(): Promise<IWishlistItem[]>;

  async work() {
    var botParamPromise = this.getBotParam();
    var wishlistItemsPromise = this.getWishlistItems();

    var result = await Promise.all([botParamPromise, wishlistItemsPromise]);

    this.botParam = result[0];
    this.wishlistItems = result[1];
  }
}

class TokenGetterTask extends WorkerTask {
  taskName = "Token Getter";

  async work() {
    return await this.getToken();
  }

  public token: string;
  private async getToken() {
    var code = this.botParam.code;
    if (!code) throw new Error("Code not found");
    var token = await csgoController.getToken(code, this.botParam.cookie);
    this.token = token.token.toString();
  }
}

abstract class InventoryGetterTask<T extends ICsGoTraderStoreItem> extends WorkerTask {
  abstract inventoryUrl: string;
  public storeItems: T[];
  public itemsToBuy: IItemToBuy[] = [];
  public wishlistItems: IWishlistItem[];
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

  async work() {
    try {
      var items = await axios.get(this.inventoryUrl, this.requestConfig);
      this.storeItems = items.data;
      this.itemsToBuy = workerHelper.generateItemsToBuy(this.storeItems, this.wishlistItems);
      this.logger.log(`${this.itemsToBuy.length} items found`);
    } catch(e) {
      this.logger.log(JSON.stringify(e.response.statusText));
    }
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

  async work() {
    var promises: Promise<boolean>[] = []
    if (!this.itemsToBuy) return Promise.resolve;
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
      that.logger.log(JSON.stringify(e.response.statusText));
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
  constructor(mongoSelector: MongoSelectorTask, tokenGetter: TokenGetterTask, inventoryGetter: InventoryGetterTask<T>, withdrawMaker: WithdrawMakerTask) {
    this.mongoSelector = mongoSelector;
    this.tokenGetter = tokenGetter;
    this.inventoryGetter = inventoryGetter;
    this.withdrawMaker = withdrawMaker
  }

  private mongoSelector: MongoSelectorTask;
  private tokenGetter: TokenGetterTask;
  private inventoryGetter: InventoryGetterTask<T>;
  private withdrawMaker: WithdrawMakerTask;

  private working = false;
  private botParam: IBotParam;
  private wishlistItems: IWishlistItem[];
  private token: string;
  private itemsToBuy: IItemToBuy[] = [];
  private apiInProgress = false;

  /**
   * work
   */
  public work() {
    cron.schedule('* * * * * *', async () => {
      await this.mongoSelector.work();
      this.botParam = this.mongoSelector.botParam;
      this.wishlistItems = this.mongoSelector.wishlistItems;
      this.working = this.mongoSelector.botParam.worker;
    });

    cron.schedule('* * * * * *', async () => {
      if (!this.working) return;
      this.tokenGetter.botParam = this.botParam;
      await this.tokenGetter.work();
      this.token = this.tokenGetter.token;
    });

    cron.schedule('*/3 * * * * *', async () => {
      if (!this.working) return;
      if (this.apiInProgress) return;

      this.apiInProgress = true;

      this.inventoryGetter.botParam = this.botParam;
      this.inventoryGetter.wishlistItems = this.wishlistItems;
      await this.inventoryGetter.work();
      this.itemsToBuy = this.inventoryGetter.itemsToBuy;

      this.withdrawMaker.token = this.token;
      this.withdrawMaker.botParam = this.botParam;
      this.withdrawMaker.itemsToBuy = this.itemsToBuy;
      await this.withdrawMaker.work();

      this.apiInProgress = false;
    });
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
    return WishlistItem.default.find({appid: 730}).exec();
  }
}

class DotaMongoSelector extends MongoSelectorTask {
  botId = botEnum.CsGoDota;

  async getWishlistItems(): Promise<IWishlistItem[]> {
    return WishlistItem.default.find({appid: 570}).exec();
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
  return new InstantWorker(mongoSelector, tokenGetter, inventoryGetter, withdrawMaker);
}

export function dotaWorker(): DotaWorker {
  var siteName = siteText(siteEnum.CsGoEmpire)
  var botName = botText(botEnum.CsGoDota);
  var logger = new ConsoleLogger(siteName, botName);
  var mongoSelector = new DotaMongoSelector(logger);
  var tokenGetter = new TokenGetterTask(logger);
  var inventoryGetter = new DotaInventoryGetterTask(logger);
  var withdrawMaker = new WithdrawMakerTask(logger);
  return new DotaWorker(mongoSelector, tokenGetter, inventoryGetter, withdrawMaker);
}
