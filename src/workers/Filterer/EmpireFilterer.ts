import { IWishlistItem } from '../../models/wishlistItem';
import { EnumSite } from '../../helpers/enum';
import { IEmpireInventoryItem } from '../../interfaces/storeItem';
import { InventoryFilterer } from './InventoryFilterer';
export abstract class EmpireFilterer<II extends IEmpireInventoryItem> extends InventoryFilterer<II> {
  site = EnumSite.CsGoEmpire;
  checkForItemToBuy(inventoryItem: II, wishlistItem: IWishlistItem): boolean {
    var filterResult = inventoryItem.name === wishlistItem.name;
    if (wishlistItem.max_price) {
      filterResult = filterResult && inventoryItem.market_value <= wishlistItem.max_price;
    }
    return filterResult;
  }
}
