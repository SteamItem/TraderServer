import { IEmpireInstantInventoryItem } from '../../interfaces/storeItem';
import { EmpireInstantWithdrawMakerTask } from "../WithdrawMaker/EmpireInstantWithdrawMakerTask";
import { Worker } from "./Worker";
import { EmpireInstantInventoryGetterTask } from "../InventoryGetter/EmpireInstantInventoryGetterTask";
import { EmpireInstantFilterer } from "../Filterer/EmpireInstantFilterer";
import { InventoryFilterer } from "../Filterer/InventoryFilterer";
import { EmpireInstantTokenGetterTask } from "../TokenGetter/EmpireInstantTokenGetterTask";
import { EmpireTokenGetterTask } from "../TokenGetter/EmpireTokenGetterTask";
import { EmpireInstantDatabaseSelector } from "../DatabaseSelector/EmpireInstantDatabaseSelector";
export class EmpireInstantWorker extends Worker<IEmpireInstantInventoryItem> {
  inventoryOperationCronExpression = '*/3 * * * * *';
  getMongoSelector(): EmpireInstantDatabaseSelector {
    return new EmpireInstantDatabaseSelector(this.logger);
  }
  getTokenGetter(): EmpireTokenGetterTask {
    return new EmpireInstantTokenGetterTask(this.botParam, this.logger);
  }
  getInventoryGetter(): EmpireInstantInventoryGetterTask {
    return new EmpireInstantInventoryGetterTask(this.botParam, this.logger);
  }
  getInventoryFilterer(): InventoryFilterer<IEmpireInstantInventoryItem> {
    return new EmpireInstantFilterer(this.inventoryItems, this.wishlistItems);
  }
  getWithdrawMaker(): EmpireInstantWithdrawMakerTask {
    return new EmpireInstantWithdrawMakerTask(this.token, this.botParam, this.itemsToBuy, this.logger);
  }
}
