import _ = require('lodash');
import { IWishlistItem } from '../../models/wishlistItem';
import { WorkerUnit } from '../Common/WorkerUnit';
export abstract class InventoryFilterer<II> extends WorkerUnit {
  workerJobName = "Filterer";
  constructor(inventoryItems: II[], wishlistItems: IWishlistItem[]) {
    super();
    this.$inventoryItems = inventoryItems;
    this.$wishlistItems = wishlistItems;
  }
  private $inventoryItems: II[];
  private $wishlistItems: IWishlistItem[];
  private $itemsToBuy: II[];
  public get itemsToBuy(): II[] {
    return this.$itemsToBuy;
  }
  public filter() {
    var itemsToBuy = [];
    this.$wishlistItems.forEach(wi => {
      var filterResult = _.filter(this.$inventoryItems, ii => {
        return this.checkForItemToBuy(ii, wi);
      });
      filterResult.forEach(r => itemsToBuy.push(r));
    });
    this.$itemsToBuy = itemsToBuy;
  }
  abstract checkForItemToBuy(inventoryItem: II, wishlistItem: IWishlistItem): boolean;
}
