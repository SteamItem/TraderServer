import { IRollbitInventoryItem } from '../../interfaces/storeItem';
import { Worker } from "./Worker";
import { WithdrawMakerTask } from "../WithdrawMaker";
import { RollbitCsGoInventoryGetterTask,  InventoryGetterTask } from "../InventoryGetter";
import { RollbitCsGoFilterer, InventoryFilterer } from "../Filterer";
import { TokenGetterTask } from "../TokenGetter";
import { DatabaseSelectorTask, RollbitCsGoDatabaseSelector } from "../DatabaseSelector";
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
