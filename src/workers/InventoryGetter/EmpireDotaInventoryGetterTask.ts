import { IEmpireDotaInventoryItem } from '../../interfaces/csgoEmpire';
import { InventoryGetterTask } from './InventoryGetterTask';
import { CSGOEmpireApi } from '../../api/csgoempire';
export class EmpireDotaInventoryGetterTask extends InventoryGetterTask<IEmpireDotaInventoryItem> {
  getStoreItems(): Promise<IEmpireDotaInventoryItem[]> {
    const api = new CSGOEmpireApi();
    const p1 = api.dotaInventory(this.botParam.cookie);
    const p2 = api.dotaInventory(this.botParam.cookie);
    const p3 = api.dotaInventory(this.botParam.cookie);
    const promises = [p1, p2, p3]
    return Promise.race(promises)
  }
}
