import { IEmpireDotaInventoryItem } from '../../interfaces/storeItem';
import { EmpireInventoryGetterTask } from './EmpireInventoryGetterTask';
export class EmpireDotaInventoryGetterTask extends EmpireInventoryGetterTask<IEmpireDotaInventoryItem> {
  inventoryUrl = "https://csgoempire.gg/api/v2/inventory/site/10";
}
