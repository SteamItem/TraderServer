import { DatabaseSelectorTask, EmpireDotaDatabaseSelector } from '../DatabaseSelector';
import { InventoryGetterTask, EmpireDotaInventoryGetterTask } from '../InventoryGetter';
import { IEmpireDotaInventoryItem } from '../../interfaces/storeItem';
import { EnumBot } from '../../helpers/enum';
import { EmpireWorkerBase } from './EmpireWorkerBase';
export class EmpireDotaWorker extends EmpireWorkerBase<IEmpireDotaInventoryItem> {
  getDatabaseSelector(): DatabaseSelectorTask {
    return new EmpireDotaDatabaseSelector(EnumBot.EmpireDota);
  }
  getInventoryGetter(): InventoryGetterTask<IEmpireDotaInventoryItem> {
    return new EmpireDotaInventoryGetterTask(this.botParam);
  }
}
