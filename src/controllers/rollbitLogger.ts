import axios from 'axios';
import _ = require('lodash');
import paramController = require('./botParam');
import logController = require('./log');
import RollbitHistory, { IRollbitHistory, IRollbitHistoryDocument } from '../models/rollbitHistory';
import { siteEnum, botEnum } from '../helpers/enum';

export class RollbitLogger {
  private cookie: string;
  private async getCookie() {
    var cookieParam = await paramController.getCookie(botEnum.RollbitCsgo);
    if (!cookieParam) throw new Error("Cookie not found");
    return cookieParam;
  }

  private items: RollbitMarketItem[] = [];
  private normalizedItems: IRollbitHistory[] = [];
  private existingItems: IRollbitHistoryDocument[] = [];
  private itemsToInsert: IRollbitHistoryDocument[] = [];

  private get requestConfig() {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': this.cookie,
        'Host': 'api.rollbit.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36'
      }
    };
  }

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
    var allItems: RollbitMarketItem[] = [];
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
    return await RollbitHistory.find({});
  }

  private async getItems(maxPrice: number) {
    return (await axios.get<RollbitMarketItems>(`https://api.rollbit.com/steam/market?query&order=1&showTradelocked=false&showCustomPriced=true&min=5&max=${maxPrice}`, this.requestConfig)).data;
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
    return logController.create(siteEnum.Rollbit, message);
  }
}

interface RollbitMarketItemDetail {
  name: string;
  image: string;
  classid: any;
  instanceid: number;
  weapon: string;
  skin: string;
  rarity: string;
  exterior: string;
  price: number;
  markup: number;
}

interface RollbitMarketItem {
  ref: string;
  price: number;
  markup: number;
  items: RollbitMarketItemDetail[];
}

interface RollbitMarketItems {
  items: RollbitMarketItem[];
}
