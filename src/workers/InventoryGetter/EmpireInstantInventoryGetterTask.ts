import { IEmpireInstantInventoryItem } from '../../interfaces/storeItem';
import { InventoryGetterTask } from './InventoryGetterTask';
import { CSGOEmpireApi } from '../../controllers/api/csgoempire';
export class EmpireInstantInventoryGetterTask extends InventoryGetterTask<IEmpireInstantInventoryItem> {
  getStoreItems(): Promise<IEmpireInstantInventoryItem[]> {
    var api = new CSGOEmpireApi();
    return api.instantInventory(this.botParam.cookie);
  }
}
