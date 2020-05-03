import { IEmpireInstantInventoryItem } from '../../interfaces/storeItem';
import { EmpireInventoryGetterTask } from './EmpireInventoryGetterTask';
export class EmpireInstantInventoryGetterTask extends EmpireInventoryGetterTask<IEmpireInstantInventoryItem> {
  inventoryUrl = "https://csgoempire.gg/api/v2/p2p/inventory/instant";
}
