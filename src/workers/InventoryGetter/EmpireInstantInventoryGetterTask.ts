import { IEmpireInstantInventoryItem } from '../../interfaces/storeItem';
import { InventoryGetterTask } from './InventoryGetterTask';
import { CSGOEmpireApi } from '../../api/csgoempire';
export class EmpireInstantInventoryGetterTask extends InventoryGetterTask<IEmpireInstantInventoryItem> {
  getStoreItems(): Promise<IEmpireInstantInventoryItem[]> {
    const api = new CSGOEmpireApi();
    return api.instantInventory(this.botParam.cookie);
  }
}
