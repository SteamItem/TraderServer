import { IEmpireDotaInventoryItem } from '../../interfaces/csgoEmpire';
import { InventoryGetterTask } from './InventoryGetterTask';
import { CSGOEmpireApi } from '../../api/csgoempire';
export class EmpireDotaInventoryGetterTask extends InventoryGetterTask<IEmpireDotaInventoryItem> {
  getStoreItems(): Promise<IEmpireDotaInventoryItem[]> {
    const api = new CSGOEmpireApi();
    return api.dotaInventory(this.botUser.cookie);
  }
}