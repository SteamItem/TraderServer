import _ = require('lodash');
import paramController = require('./botParam');
import logController = require('./log');
import RollbitHistory, { IRollbitHistory, IRollbitHistoryDocument } from '../models/rollbitHistory';
import { EnumBot, getBotText } from '../helpers/enum';
import { IRollbitInventoryItem } from '../interfaces/storeItem';
import { RollbitApi } from './api/rollbit';

export class RollbitLogger {
  private cookie: string;
  private async getCookie() {
    var cookieParam = await paramController.findOne(EnumBot.RollbitCsGo);
    if (!cookieParam.cookie) throw new Error("Cookie not found");
    return cookieParam.cookie;
  }

  private items: IRollbitInventoryItem[] = [];
  private normalizedItems: IRollbitHistory[] = [];
  private existingItems: IRollbitHistoryDocument[] = [];
  private itemsToInsert: IRollbitHistoryDocument[] = [];

  public async startLogging() {
    var that = this;
    try {
      that.cookie = await that.getCookie();

      var allItemsPromise = that.getAllItems();
      var existingItemsPromise = that.getExistingItems();
      var promiseResult = await Promise.all([allItemsPromise, existingItemsPromise]);
      that.items = promiseResult[0];
      that.existingItems = promiseResult[1];

      that.normalizedItems = that.normalizeItems();
      that.itemsToInsert = that.getItemsToInsert();
      await that.saveNewItems();
    } catch (e) {
      that.handleError(e.message);
    } finally {
      that.startLogging();
    }
  }

  private async getAllItems() {
    var allItems: IRollbitInventoryItem[] = [];
    var newItemExist = true;
    var maxPrice = 500;
    var iterationLimit = 2;
    var iteration = 0;
    while(newItemExist && iteration < iterationLimit) {
      iteration++;
      var currentResult = await this.getItems(maxPrice);
      var currentItems = currentResult.items;
      if (currentItems.length > 0) {
        currentItems.forEach(i => allItems.push(i));
        var minItem = _.last(allItems);
        if (!minItem) {
          newItemExist = false;
        } else {
          maxPrice = minItem.price;
        }
      } else {
        newItemExist = false;
      }
    }
    return allItems;
  }

  private async getExistingItems() {
    return RollbitHistory.find({});
  }

  private getItems(maxPrice: number) {
    var api = new RollbitApi();
    return api.csgoInventory(this.cookie, 5, maxPrice);
  }

  private normalizeItems(): IRollbitHistory[] {
    var normalizeItems: IRollbitHistory[] = []
    this.items.forEach(i => {
      normalizeItems.push({
        ref: i.ref,
        price: i.price,
        markup: i.markup,
        name: i.items.map(ii => ii.name).join("#"),
        weapon: i.items.map(ii => ii.weapon).join("#"),
        skin: i.items.map(ii => ii.skin).join("#"),
        rarity: i.items.map(ii => ii.rarity).join("#"),
        exterior: i.items.map(ii => ii.exterior).join("#"),
        baseprice: _.sumBy(i.items, ii => ii.price)
      });
    });
    return normalizeItems;
  }

  private getItemsToInsert() {
    var itemsToInsert: IRollbitHistoryDocument[] = [];
    this.normalizedItems.forEach(i => {
      var foundItem = _.find(this.existingItems, ei => (ei.ref === i.ref && ei.price === i.price));
      if (!foundItem) {
        var itemToInsert = new RollbitHistory({
          ref: i.ref,
          price: i.price,
          markup: i.markup,
          name: i.name,
          weapon: i.weapon,
          skin: i.skin,
          rarity: i.rarity,
          exterior: i.exterior,
          baseprice: i.baseprice
        });
        itemsToInsert.push(itemToInsert);
      }
    });
    return itemsToInsert;
  }

  private async saveNewItems() {
    if (this.itemsToInsert.length == 0) return;
    await RollbitHistory.insertMany(this.itemsToInsert);
  }

  private handleError(message: string) {
    this.log(`Error: ${message}`)
  }

  private log(message: string) {
    var botName = getBotText(EnumBot.RollbitCsGo);
    return logController.create(botName, message);
  }
}