import { IEmpireDotaInventoryItem } from '../../interfaces/storeItem';
import { EmpireDotaWithdrawMakerTask } from "../WithdrawMaker";
import { Worker } from "./Worker";
import { EmpireDotaInventoryGetterTask } from "../InventoryGetter";
import { EmpireDotaFilterer, InventoryFilterer } from "../Filterer";
import { EmpireDotaTokenGetterTask, EmpireTokenGetterTask } from "../TokenGetter";
import { DatabaseSelectorTask, EmpireDotaDatabaseSelector } from "../DatabaseSelector";
export class EmpireDotaWorker extends Worker<IEmpireDotaInventoryItem> {
  inventoryOperationCronExpression = '*/3 * * * * *';
  getDatabaseSelector(): DatabaseSelectorTask {
    return new EmpireDotaDatabaseSelector();
  }
  getTokenGetter(): EmpireTokenGetterTask {
    return new EmpireDotaTokenGetterTask(this.botParam);
  }
  getInventoryGetter(): EmpireDotaInventoryGetterTask {
    return new EmpireDotaInventoryGetterTask(this.botParam);
  }
  getInventoryFilterer(): InventoryFilterer<IEmpireDotaInventoryItem> {
    return new EmpireDotaFilterer(this.inventoryItems, this.wishlistItems);
  }
  getWithdrawMaker(): EmpireDotaWithdrawMakerTask {
    return new EmpireDotaWithdrawMakerTask(this.token, this.botParam, this.itemsToBuy);
  }
}
