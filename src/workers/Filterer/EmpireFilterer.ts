import { IWishlistItem } from '../../models/wishlistItem';
import { IEmpireInventoryItem } from '../../interfaces/storeItem';
import { InventoryFilterer } from './InventoryFilterer';
export class EmpireFilterer<II extends IEmpireInventoryItem> extends InventoryFilterer<II> {
  checkForItemToBuy(inventoryItem: II, wishlistItem: IWishlistItem): boolean {
    var filterResult = inventoryItem.name === wishlistItem.name;
    if (wishlistItem.max_price) {
      filterResult = filterResult && inventoryItem.market_value <= wishlistItem.max_price;
    }
    return filterResult;
  }
}
