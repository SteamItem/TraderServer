import _ = require('lodash');
import { IEmpireInventoryItem } from '../../interfaces/storeItem';
import { InventoryFiltererUnit } from './InventoryFiltererUnit';
export class EmpireInventoryFilterer<II extends IEmpireInventoryItem> extends InventoryFiltererUnit<II> {
  getItemName(inventoryItem: II): string {
    return inventoryItem.name;
  }
  getItemPrice(inventoryItem: II) {
    return inventoryItem.market_value;
  }
}
