import { IEmpireDotaInventoryItem } from '../../interfaces/storeItem';
import { EmpireDotaWithdrawMakerTask } from "../WithdrawMaker/EmpireDotaWithdrawMakerTask";
import { Worker } from "./Worker";
import { EmpireDotaInventoryGetterTask } from "../InventoryGetter/EmpireDotaInventoryGetterTask";
import { EmpireDotaFilterer } from "../Filterer/EmpireDotaFilterer";
import { InventoryFilterer } from "../Filterer/InventoryFilterer";
import { EmpireDotaTokenGetterTask } from "../TokenGetter/EmpireDotaTokenGetterTask";
import { EmpireTokenGetterTask } from "../TokenGetter/EmpireTokenGetterTask";
import { MongoSelectorTask } from "../MongoSelector/MongoSelectorTask";
import { EmpireDotaMongoSelector } from "../MongoSelector/EmpireDotaMongoSelector";
export class EmpireDotaWorker extends Worker<IEmpireDotaInventoryItem> {
  inventoryOperationCronExpression = '*/3 * * * * *';
  getMongoSelector(): MongoSelectorTask {
    return new EmpireDotaMongoSelector(this.logger);
  }
  getTokenGetter(): EmpireTokenGetterTask {
    return new EmpireDotaTokenGetterTask(this.botParam, this.logger);
  }
  getInventoryGetter(): EmpireDotaInventoryGetterTask {
    return new EmpireDotaInventoryGetterTask(this.botParam, this.logger);
  }
  getInventoryFilterer(): InventoryFilterer<IEmpireDotaInventoryItem> {
    return new EmpireDotaFilterer(this.inventoryItems, this.wishlistItems);
  }
  getWithdrawMaker(): EmpireDotaWithdrawMakerTask {
    return new EmpireDotaWithdrawMakerTask(this.token, this.botParam, this.itemsToBuy, this.logger);
  }
}
