import { IRollbitInventoryItem } from '../../interfaces/storeItem';
import { InventoryFilterer } from './InventoryFilterer';
export class RollbitInventoryFilterer extends InventoryFilterer<IRollbitInventoryItem> {
  getItemName(inventoryItem: IRollbitInventoryItem) {
    return inventoryItem.items.map(ii => ii.name).join("#");
  }
  getItemPrice(inventoryItem: IRollbitInventoryItem) {
    return inventoryItem.price;
  }
}