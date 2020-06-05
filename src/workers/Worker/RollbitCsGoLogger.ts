import { IRollbitSocketItem } from '../../interfaces/storeItem';
import { IRollbitHistory } from '../../interfaces/rollbit';
import { RollbitWorkerBase } from './RollbitWorkerBase';
import _ = require('lodash');
import { EnumBot } from '../../helpers/enum';
import { DataApi } from '../../api/data';
export class RollbitCsGoLogger extends RollbitWorkerBase {
  bot = EnumBot.RollbitCsGoLogger;
  async onSteamMarketItem(item: IRollbitSocketItem): Promise<void> {
    const normalizedItem = this.normalizeItem(item);
    if (item.state === 'listed') {
      await this.saveListedItem(normalizedItem);
    }
    if (item.state === 'gone') {
      await this.saveGoneItem(normalizedItem);
    }
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

  private saveListedItem(item: IRollbitHistory) {
    const data = new DataApi();
    item.listed_at = new Date();
    return data.updateRollbitHistoryListed(item);
  }

  private saveGoneItem(item: IRollbitHistory) {
    const data = new DataApi();
    item.gone_at = new Date();
    return data.updateRollbitHistoryGone(item);
  }
}