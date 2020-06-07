import _ = require('lodash');
import { InventoryGetterTask } from './InventoryGetterTask';
import { RollbitApi } from '../../api/rollbit';
import { IRollbitInventoryItem } from '../../interfaces/rollbit';
export class RollbitCsGoInventoryGetterTask extends InventoryGetterTask<IRollbitInventoryItem> {
  private minPrice = 5;
  private maxPrice = 500;
  private iterationLimit = 1;

  async getStoreItems(): Promise<IRollbitInventoryItem[]> {
    const allItems: IRollbitInventoryItem[] = [];
    const minPrice = this.minPrice;
    let maxPrice = this.maxPrice;
    let iteration = 0;
    while (iteration < this.iterationLimit) {
      iteration++;
      const currentResult = await this.getItems(minPrice, maxPrice);
      const currentItems = currentResult.items;
      if (currentItems.length > 0) {
        currentItems.forEach(i => allItems.push(i));
        const minItem = _.last(allItems);
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
    const api = new RollbitApi();
    return await api.csgoInventory(this.botParam.cookie, minPrice, maxPrice);
  }
}
