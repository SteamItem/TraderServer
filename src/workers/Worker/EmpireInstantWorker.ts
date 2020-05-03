import { DatabaseSelectorTask, EmpireInstantDatabaseSelector } from '../DatabaseSelector';
import { InventoryGetterTask, EmpireInstantInventoryGetterTask } from '../InventoryGetter';
import { IEmpireInstantInventoryItem } from '../../interfaces/storeItem';
import { EnumBot } from '../../helpers/enum';
import { EmpireWorkerBase } from './EmpireWorkerBase';
export class EmpireInstantWorker extends EmpireWorkerBase<IEmpireInstantInventoryItem> {
  getDatabaseSelector(): DatabaseSelectorTask {
    return new EmpireInstantDatabaseSelector(EnumBot.EmpireInstant);
  }
  getInventoryGetter(): InventoryGetterTask<IEmpireInstantInventoryItem> {
    return new EmpireInstantInventoryGetterTask(this.botParam);
  }
}
