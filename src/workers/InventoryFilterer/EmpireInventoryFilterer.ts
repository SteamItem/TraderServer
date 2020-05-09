import _ = require('lodash');
import { IEmpireInventoryItem } from '../../interfaces/storeItem';
import { InventoryFiltererUnit } from './InventoryFiltererUnit';
export class EmpireInventoryFilterer<II extends IEmpireInventoryItem> extends InventoryFiltererUnit<II> {
  getItemName(inventoryItem: II): string {
    return inventoryItem.name;
  }
  getItemPrice(inventoryItem: II) {
    return inventoryItem.market_value / 100;
  }
  isNewItemSuitable(inventoryItemToAdd: II, currentlySelectedInventoryItems: II[]): boolean {
    const maxItemPerBot = 20;
    const currentBotItems = _.filter(currentlySelectedInventoryItems, ii => ii.bot_id === inventoryItemToAdd.bot_id);
    return currentBotItems.length < maxItemPerBot;
  }
  afterFilterAction(inventoryItems: II[]) {
    return _.shuffle(inventoryItems);
  }
}
