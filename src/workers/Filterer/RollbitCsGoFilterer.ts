import { IWishlistItem } from '../../models/wishlistItem';
import { IRollbitInventoryItem } from '../../interfaces/storeItem';
import { InventoryFilterer } from './InventoryFilterer';
export class RollbitCsGoFilterer extends InventoryFilterer<IRollbitInventoryItem> {
  checkForItemToBuy(inventoryItem: IRollbitInventoryItem, wishlistItem: IWishlistItem): boolean {
    if (inventoryItem.items.length != 1)
      return false;
    var inventoryItemName = inventoryItem.items[0].name;
    var filterResult = inventoryItemName === wishlistItem.name;
    if (wishlistItem.max_price) {
      filterResult = filterResult && inventoryItem.price <= wishlistItem.max_price;
    }
    return filterResult;
  }
}
