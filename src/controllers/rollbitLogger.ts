import _ = require('lodash');
import paramController = require('./botParam');
import logController = require('./log');
import RollbitHistory, { IRollbitHistory } from '../models/rollbitHistory';
import { EnumBot, getBotText } from '../helpers/enum';
import { IRollbitSocketItem } from '../interfaces/storeItem';
import { RollbitSocket } from './api/rollbitSocket';

export class RollbitLogger {
  private cookie: string;
  private async getCookie() {
    var cookieParam = await paramController.findOne(EnumBot.RollbitCsGo);
    if (!cookieParam.cookie) throw new Error("Cookie not found");
    return cookieParam.cookie;
  }

  private socket: RollbitSocket;

  public async startLogging() {
    var that = this;
    try {
      that.cookie = await that.getCookie();

      that.socket = new RollbitSocket();
      that.socket.connect(that.cookie);

      that.beginSync();
      that.beginMarketListen();
    } catch (e) {
      that.handleError(e.message);
    }
  }

  private beginSync() {
    var that = this;
    setInterval(function () {
      that.socket.send('sync', '', that.cookie, true);
    }, 2500);
  }

  private beginMarketListen() {
    var that = this;
    that.socket.listen('steam/market', async (item: IRollbitSocketItem) => {
      var normalizedItem = that.normalizeItem(item);
      if (item.state === 'listed') {
        await that.saveListedItem(normalizedItem);
      }
      if (item.state === 'gone') {
        await that.saveGoneItem(normalizedItem);
      }
    })
  }

  private saveListedItem(item: IRollbitHistory) {
    item.listed_at = new Date();
    const history = new RollbitHistory(item);
    return history.save();
  }

  private saveGoneItem(item: IRollbitHistory) {
    item.gone_at = new Date();
    return RollbitHistory.findOneAndUpdate({ref: item.ref}, { $set: {ref: item.ref, price: item.price, markup: item.markup, name: item.name, weapon: item.weapon, skin: item.skin, rarity: item.rarity, exterior: item.exterior, baseprice: item.baseprice, gone_at: item.gone_at} }, { upsert: true, new: true }).exec();
  }

  private normalizeItem(item: IRollbitSocketItem): IRollbitHistory {
    return {
      ref: item.ref,
      price: item.price,
      markup: item.markup,
      name: item.items.map(ii => ii.name).join("#"),
      weapon: item.items.map(ii => ii.weapon).join("#"),
      skin: item.items.map(ii => ii.skin).join("#"),
      rarity: item.items.map(ii => ii.rarity).join("#"),
      exterior: item.items.map(ii => ii.exterior).join("#"),
      baseprice: _.sumBy(item.items, ii => ii.price)
    };
  }

  private handleError(message: string) {
    this.log(`Error: ${message}`)
  }

  private log(message: string) {
    var botName = getBotText(EnumBot.RollbitCsGo);
    return logController.create(botName, message);
  }
}
