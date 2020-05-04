import { IEmpireDotaInventoryItem } from '../../interfaces/storeItem';
import { InventoryGetterTask } from './InventoryGetterTask';
import { CSGOEmpireApi } from '../../controllers/api/csgoempire';
export class EmpireDotaInventoryGetterTask extends InventoryGetterTask<IEmpireDotaInventoryItem> {
  getStoreItems(): Promise<IEmpireDotaInventoryItem[]> {
    var api = new CSGOEmpireApi();
    return api.dotaInventory(this.botParam.cookie);
  }
}
