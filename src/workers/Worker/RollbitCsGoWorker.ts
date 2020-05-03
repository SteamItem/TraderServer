import { DatabaseSelectorTask, RollbitCsGoDatabaseSelector } from '../DatabaseSelector';
import { InventoryFiltererUnit, RollbitInventoryFilterer } from '../InventoryFilterer';
import { InventoryGetterTask, RollbitCsGoInventoryGetterTask } from '../InventoryGetter';
import { WithdrawMakerTask, RollbitCsGoWithdrawMakerTask } from '../WithdrawMaker';
import { IRollbitInventoryItem } from '../../interfaces/storeItem';
import { EnumBot } from '../../helpers/enum';
import { WorkerBase } from "./WorkerBase";
import { BalanceCheckerTask } from '../BalanceChecker';
export class RollbitCsGoWorker extends WorkerBase<IRollbitInventoryItem> {
  inventoryOperationCronExpression = '* * * * * *';
  getDatabaseSelector(): DatabaseSelectorTask {
    return new RollbitCsGoDatabaseSelector(EnumBot.RollbitCsGo);
  }
  getBalanceChecker(): BalanceCheckerTask {
    // TODO: tamamla
    throw new Error("Method not implemented.");
  }
  getInventoryGetter(): InventoryGetterTask<IRollbitInventoryItem> {
    return new RollbitCsGoInventoryGetterTask(this.botParam);
  }
  getInventoryFilterer(): InventoryFiltererUnit<IRollbitInventoryItem> {
    return new RollbitInventoryFilterer(this.balance, this.inventoryItems, this.wishlistItems);
  }
  getWithdrawMaker(): WithdrawMakerTask<IRollbitInventoryItem> {
    return new RollbitCsGoWithdrawMakerTask(this.botParam, this.itemsToBuy);
  }
  async schedule() {
    this.databaseScheduler();
    this.balanceChecker();
    this.inventoryScheduler();
  }
}
