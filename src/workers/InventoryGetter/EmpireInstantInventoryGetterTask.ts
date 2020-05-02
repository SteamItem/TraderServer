import { EnumSite, EnumBot } from '../../helpers/enum';
import { IEmpireInstantInventoryItem } from '../../interfaces/storeItem';
import { EmpireInventoryGetterTask } from './EmpireInventoryGetterTask';
export class EmpireInstantInventoryGetterTask extends EmpireInventoryGetterTask<IEmpireInstantInventoryItem> {
  site = EnumSite.CsGoEmpire;
  bot = EnumBot.EmpireInstant;
  inventoryUrl = "https://csgoempire.gg/api/v2/p2p/inventory/instant";
}
