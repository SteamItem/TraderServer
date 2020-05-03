import { IRollbitInventoryItem } from '../../interfaces/storeItem';
import { InventoryFiltererUnit } from './InventoryFiltererUnit';
export class RollbitInventoryFilterer extends InventoryFiltererUnit<IRollbitInventoryItem> {
  getItemName(inventoryItem: IRollbitInventoryItem) {
    return inventoryItem.items.map(ii => ii.name).join("#");
  }
  getItemPrice(inventoryItem: IRollbitInventoryItem) {
    return inventoryItem.price;
  }
}