import axios from 'axios';
import _ = require('lodash');
import { EnumSite, EnumBot } from '../../helpers/enum';
import { IRollbitInventoryItem, IRollbitInventoryItems } from '../../interfaces/storeItem';
import { InventoryGetterTask } from './InventoryGetterTask';
export class RollbitCsGoInventoryGetterTask extends InventoryGetterTask<IRollbitInventoryItem> {
  site = EnumSite.Rollbit;
  bot = EnumBot.RollbitCsGo;
  workerJobName = "Inventory Getter";

  private maxPrice = 500;
  private minPrice = 5;
  private iterationLimit = 2;
  private get requestConfig() {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': this.botParam.cookie,
        'Host': 'csgoempire.gg'
      }
    };
  }
  async getStoreItems() {
    var allItems: IRollbitInventoryItem[] = [];
    var maxPrice = this.maxPrice;
    var minPrice = this.minPrice;
    var iteration = 0;
    while (iteration < this.iterationLimit) {
      iteration++;
      var currentResult = await this.getItems(maxPrice, minPrice);
      var currentItems = currentResult.items;
      if (currentItems.length > 0) {
        currentItems.forEach(i => allItems.push(i));
        var minItem = _.last(allItems);
        if (minItem) {
          maxPrice = minItem.price;
        }
        else {
          break;
        }
      }
    }
    return allItems;
  }
  private async getItems(maxPrice: number, minPrice: number) {
    var result = await axios.get<IRollbitInventoryItems>(`https://api.rollbit.com/steam/market?query&order=1&showTradelocked=false&showCustomPriced=true&min=${minPrice}&max=${maxPrice}`, this.requestConfig);
    return result.data;
  }
}
