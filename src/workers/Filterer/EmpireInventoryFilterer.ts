import _ = require('lodash');
import { IWishlistItem } from '../../models/wishlistItem';
import { IEmpireInventoryItem } from '../../interfaces/storeItem';
import { InventoryFilterer } from './InventoryFilterer';
export class EmpireInventoryFilterer<II extends IEmpireInventoryItem> extends InventoryFilterer<II> {
  getItemName(inventoryItem: II): string {
    return inventoryItem.name;
  }
  getItemPrice(inventoryItem: II) {
    return inventoryItem.market_value;
  }
}
