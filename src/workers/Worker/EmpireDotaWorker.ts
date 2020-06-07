import { EnumBot } from '../../helpers/enum';
import { EmpireWorkerBase } from './EmpireWorkerBase';
import { DatabaseSelectorTask } from '../DatabaseSelector/DatabaseSelectorTask';
import { EmpireDotaDatabaseSelector } from '../DatabaseSelector/EmpireDotaDatabaseSelector';
import { InventoryGetterTask } from '../InventoryGetter/InventoryGetterTask';
import { EmpireDotaInventoryGetterTask } from '../InventoryGetter/EmpireDotaInventoryGetterTask';
import { IEmpireDotaInventoryItem } from '../../interfaces/csgoEmpire';
export class EmpireDotaWorker extends EmpireWorkerBase<IEmpireDotaInventoryItem> {
  bot = EnumBot.EmpireDota;
  getDatabaseSelector(): DatabaseSelectorTask {
    return new EmpireDotaDatabaseSelector(EnumBot.EmpireDota);
  }
  getInventoryGetter(): InventoryGetterTask<IEmpireDotaInventoryItem> {
    return new EmpireDotaInventoryGetterTask(this.botParam);
  }
}
