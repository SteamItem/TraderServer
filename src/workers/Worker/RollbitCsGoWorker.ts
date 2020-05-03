import { DatabaseSelectorTask, RollbitCsGoDatabaseSelector } from '../DatabaseSelector';
import { InventoryFilterer, RollbitCsGoFilterer } from '../Filterer';
import { InventoryGetterTask, RollbitCsGoInventoryGetterTask } from '../InventoryGetter';
import { WithdrawMakerTask, RollbitCsGoWithdrawMakerTask } from '../WithdrawMaker';
import { IRollbitInventoryItem } from '../../interfaces/storeItem';
import { EnumBot } from '../../helpers/enum';
import { WorkerBase } from "./WorkerBase";
export class RollbitCsGoWorker extends WorkerBase<IRollbitInventoryItem> {
  inventoryOperationCronExpression = '* * * * * *';
  getDatabaseSelector(): DatabaseSelectorTask {
    return new RollbitCsGoDatabaseSelector(EnumBot.RollbitCsGo);
  }
  getInventoryGetter(): InventoryGetterTask<IRollbitInventoryItem> {
    return new RollbitCsGoInventoryGetterTask(this.botParam);
  }
  getInventoryFilterer(): InventoryFilterer<IRollbitInventoryItem> {
    return new RollbitCsGoFilterer(this.inventoryItems, this.wishlistItems);
  }
  getWithdrawMaker(): WithdrawMakerTask<IRollbitInventoryItem> {
    return new RollbitCsGoWithdrawMakerTask(this.botParam, this.itemsToBuy);
  }
  async schedule() {
    this.databaseScheduler();
    this.inventoryScheduler();
  }
}
