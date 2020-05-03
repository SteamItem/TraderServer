import axios from 'axios';
import _ = require('lodash');
import { IRollbitInventoryItem, IRollbitInventoryItems } from '../../interfaces/storeItem';
import { InventoryGetterTask } from './InventoryGetterTask';
export class RollbitCsGoInventoryGetterTask extends InventoryGetterTask<IRollbitInventoryItem> {
  inventoryUrl = "https://api.rollbit.com/steam/market";

  private maxPrice = 500;
  private minPrice = 5;
  private iterationLimit = 1;
  private get requestConfig() {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': this.botParam.cookie,
        'Host': 'api.rollbit.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36'
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
        } else {
          break;
        }
      }
    }
    return allItems;
  }
  private async getItems(maxPrice: number, minPrice: number) {
    var result = await axios.get<IRollbitInventoryItems>(`${this.inventoryUrl}?query&order=1&showTradelocked=false&showCustomPriced=false&min=${minPrice}&max=${maxPrice}`, this.requestConfig);
    return result.data;
  }
}
