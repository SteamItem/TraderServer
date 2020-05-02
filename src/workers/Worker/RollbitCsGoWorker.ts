import { IRollbitInventoryItem } from '../../interfaces/storeItem';
import { Worker } from "./Worker";
import { WithdrawMakerTask } from "../WithdrawMaker/WithdrawMakerTask";
import { RollbitCsGoInventoryGetterTask } from "../InventoryGetter/RollbitCsGoInventoryGetterTask";
import { InventoryGetterTask } from "../InventoryGetter/InventoryGetterTask";
import { RollbitCsGoFilterer } from "../Filterer/RollbitCsGoFilterer";
import { InventoryFilterer } from "../Filterer/InventoryFilterer";
import { TokenGetterTask } from "../TokenGetter/TokenGetterTask";
import { DatabaseSelectorTask } from "../DatabaseSelector/DatabaseSelectorTask";
import { RollbitCsGoDatabaseSelector } from "../DatabaseSelector/RollbitCsGoDatabaseSelector";
export class RollbitCsGoWorker extends Worker<IRollbitInventoryItem> {
  inventoryOperationCronExpression = '* * * * * *';
  getMongoSelector(): DatabaseSelectorTask {
    return new RollbitCsGoDatabaseSelector();
  }
  getTokenGetter(): TokenGetterTask {
    // TODO: Method not implemented;
    throw new Error("Method not implemented.");
  }
  getInventoryGetter(): InventoryGetterTask<IRollbitInventoryItem> {
    return new RollbitCsGoInventoryGetterTask(this.botParam);
  }
  getInventoryFilterer(): InventoryFilterer<IRollbitInventoryItem> {
    return new RollbitCsGoFilterer(this.inventoryItems, this.wishlistItems);
  }
  getWithdrawMaker(): WithdrawMakerTask<IRollbitInventoryItem> {
    // TODO: Method not implemented;
    throw new Error("Method not implemented.");
  }
}
