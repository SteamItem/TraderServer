import _ = require('lodash');
import { IWishlistItem } from '../../models/wishlistItem';
import { WorkerUnit } from '../Common/WorkerUnit';
import helpers from '../../helpers';
import { LoggerBase } from '../Logger/LoggerBase';
export abstract class InventoryFiltererUnit<II> extends WorkerUnit {
  taskName = "Inventory Filterer";
  constructor(balance: number, inventoryItems: II[], wishlistItems: IWishlistItem[], logger: LoggerBase) {
    super();
    this.$balance = balance;
    this.$inventoryItems = inventoryItems;
    this.$wishlistItems = wishlistItems;
    this.logger = logger;
  }
  private $balance: number;
  private $inventoryItems: II[];
  public get inventoryItems(): II[] {
    return this.$inventoryItems;
  }
  private $wishlistItems: IWishlistItem[];
  protected logger: LoggerBase;
  private $wishlistFilteredItems: II[];
  public get wishlistFilteredItems(): II[] {
    return this.$wishlistFilteredItems;
  }
  private $itemsToBuy: II[];
  public get itemsToBuy(): II[] {
    return this.$itemsToBuy;
  }
  public filter() {
    var itemsToBuy: II[] = [];
    itemsToBuy = this.filterForWishlist();
    this.$wishlistFilteredItems = itemsToBuy;
    itemsToBuy = this.afterFilterAction(itemsToBuy);
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

  afterFilterAction(inventoryItems: II[]) {
    return inventoryItems;
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
    if (itemsToBuy.length > 0) {
      this.logger.log(`Current Balance: ${this.$balance}, Selected Items Balance: ${selectedBalance}, ${itemsToBuy.length} items`)
    }
    return itemsToBuy;
  }

  private checkForItemToBuy(inventoryItem: II, wishlistItem: IWishlistItem): boolean {
    var itemName = this.getItemName(inventoryItem);
    var itemPrice = this.getItemPrice(inventoryItem)

    var filterResult = helpers.compareStrings(itemName, wishlistItem.name);
    if (wishlistItem.max_price) {
      filterResult = filterResult && itemPrice <= wishlistItem.max_price;
    }
    return filterResult;
  }

  abstract getItemName(inventoryItem: II): string;
  abstract getItemPrice(inventoryItem: II): number;
  isNewItemSuitable(inventoryItemToAdd: II, currentlySelectedInventoryItems: II[]): boolean {
    return true;
  }
}
