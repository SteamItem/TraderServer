import _ = require('lodash');
import { IWishlistItem } from '../../models/wishlistItem';
import { WorkerUnit } from '../Common/WorkerUnit';
export abstract class InventoryFiltererUnit<II> extends WorkerUnit {
  workerJobName = "Inventory Filterer";
  constructor(balance: number, inventoryItems: II[], wishlistItems: IWishlistItem[]) {
    super();
    this.$balance = balance;
    this.$inventoryItems = inventoryItems;
    this.$wishlistItems = wishlistItems;
  }
  private $balance: number;
  private $inventoryItems: II[];
  private $wishlistItems: IWishlistItem[];
  private $itemsToBuy: II[];
  public get itemsToBuy(): II[] {
    return this.$itemsToBuy;
  }
  public filter() {
    var itemsToBuy: II[] = [];
    itemsToBuy = this.filterForWishlist();
    itemsToBuy = this.filterForBalance(itemsToBuy);
    this.$itemsToBuy = itemsToBuy;
  }
  private filterForWishlist(): II[] {
    var itemsToBuy = [];
    this.$wishlistItems.forEach(wi => {
      var filterResult = _.filter(this.$inventoryItems, ii => {
        return this.checkForItemToBuy(ii, wi);
      });
      filterResult.forEach(r => itemsToBuy.push(r));
    });
    console.log(`Suits for Wishlist: ${itemsToBuy.length}`);
    return itemsToBuy;
  }

  private filterForBalance(inventoryItems: II[]): II[] {
    var itemsToBuy: II[] = [];
    var currentBalance = this.$balance;
    var selectedBalance = 0;
    inventoryItems.forEach(ii => {
      var itemPrice = this.getItemPrice(ii);
      if (itemPrice <= currentBalance) {
        var suitableFilter = this.isNewItemSuitable(ii, itemsToBuy);
        if (suitableFilter) {
          itemsToBuy.push(ii);
          currentBalance -= itemPrice;
          selectedBalance += itemPrice;
        }
      }
    });
    console.log(`Current Balance: ${this.$balance}, Selected Items Balance: ${selectedBalance}, ${itemsToBuy.length} items`)
    return itemsToBuy;
  }

  private checkForItemToBuy(inventoryItem: II, wishlistItem: IWishlistItem): boolean {
    var itemName = this.getItemName(inventoryItem);
    var itemPrice = this.getItemPrice(inventoryItem)
    var filterResult = itemName === wishlistItem.name;
    if (wishlistItem.max_price) {
      filterResult = filterResult && itemPrice <= wishlistItem.max_price;
    }
    return filterResult;
  }

  abstract getItemName(inventoryItem: II): string;
  abstract getItemPrice(inventoryItem: II): number;
  abstract isNewItemSuitable(inventoryItemToAdd: II, currentlySelectedInventoryItems: II[]): boolean;
}
