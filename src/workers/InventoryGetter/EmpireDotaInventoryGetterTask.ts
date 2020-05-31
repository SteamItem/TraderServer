import { IEmpireDotaInventoryItem } from '../../interfaces/storeItem';
import { InventoryGetterTask } from './InventoryGetterTask';
import { CSGOEmpireApi } from '../../api/csgoempire';
export class EmpireDotaInventoryGetterTask extends InventoryGetterTask<IEmpireDotaInventoryItem> {
  getStoreItems(): Promise<IEmpireDotaInventoryItem[]> {
    var api = new CSGOEmpireApi();
    var p1 = api.dotaInventory(this.botParam.cookie);
    var p2 = api.dotaInventory(this.botParam.cookie);
    var p3 = api.dotaInventory(this.botParam.cookie);
    var promises = [p1, p2, p3]
    return Promise.race(promises)

    // return api.dotaInventory(this.botParam.cookie);
  }
}
