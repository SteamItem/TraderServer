import { IEmpireInstantInventoryItem } from '../../interfaces/storeItem';
import { EmpireInstantWithdrawMakerTask } from "../WithdrawMaker";
import { Worker } from "./Worker";
import { EmpireInstantInventoryGetterTask } from "../InventoryGetter";
import { EmpireInstantFilterer, InventoryFilterer } from "../Filterer";
import { EmpireInstantTokenGetterTask, EmpireTokenGetterTask } from "../TokenGetter";
import { EmpireInstantDatabaseSelector } from "../DatabaseSelector";
export class EmpireInstantWorker extends Worker<IEmpireInstantInventoryItem> {
  inventoryOperationCronExpression = '*/3 * * * * *';
  getMongoSelector(): EmpireInstantDatabaseSelector {
    return new EmpireInstantDatabaseSelector();
  }
  getTokenGetter(): EmpireTokenGetterTask {
    return new EmpireInstantTokenGetterTask(this.botParam);
  }
  getInventoryGetter(): EmpireInstantInventoryGetterTask {
    return new EmpireInstantInventoryGetterTask(this.botParam);
  }
  getInventoryFilterer(): InventoryFilterer<IEmpireInstantInventoryItem> {
    return new EmpireInstantFilterer(this.inventoryItems, this.wishlistItems);
  }
  getWithdrawMaker(): EmpireInstantWithdrawMakerTask {
    return new EmpireInstantWithdrawMakerTask(this.token, this.botParam, this.itemsToBuy);
  }
}
