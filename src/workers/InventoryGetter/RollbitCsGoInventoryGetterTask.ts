import _ = require('lodash');
import { IRollbitInventoryItem } from '../../interfaces/storeItem';
import { InventoryGetterTask } from './InventoryGetterTask';
import { RollbitApi } from '../../controllers/api/rollbit';
export class RollbitCsGoInventoryGetterTask extends InventoryGetterTask<IRollbitInventoryItem> {
  private minPrice = 5;
  private maxPrice = 500;
  private iterationLimit = 1;

  async getStoreItems() {
    var allItems: IRollbitInventoryItem[] = [];
    var minPrice = this.minPrice;
    var maxPrice = this.maxPrice;
    var iteration = 0;
    while (iteration < this.iterationLimit) {
      iteration++;
      var currentResult = await this.getItems(minPrice, maxPrice);
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
  private async getItems(minPrice: number, maxPrice: number) {
    var api = new RollbitApi();
    return await api.csgoInventory(this.botParam.cookie, minPrice, maxPrice);
  }
}
