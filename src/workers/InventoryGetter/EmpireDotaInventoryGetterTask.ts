import { EnumSite, EnumBot } from '../../helpers/enum';
import { IEmpireDotaInventoryItem } from '../../interfaces/storeItem';
import { EmpireInventoryGetterTask } from './EmpireInventoryGetterTask';
export class EmpireDotaInventoryGetterTask extends EmpireInventoryGetterTask<IEmpireDotaInventoryItem> {
  site = EnumSite.CsGoEmpire;
  bot = EnumBot.EmpireDota;
  inventoryUrl = "https://csgoempire.gg/api/v2/inventory/site/10";
}
