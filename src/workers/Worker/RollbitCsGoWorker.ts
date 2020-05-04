import { IRollbitInventoryItem } from '../../interfaces/storeItem';
import { EnumBot } from '../../helpers/enum';
import { WorkerBase } from "./WorkerBase";
import { DatabaseSelectorTask } from '../DatabaseSelector/DatabaseSelectorTask';
import { RollbitCsGoDatabaseSelector } from '../DatabaseSelector/RollbitCsGoDatabaseSelector';
import { BalanceCheckerTask } from '../BalanceChecker/BalanceCheckerTask';
import { InventoryGetterTask } from '../InventoryGetter/InventoryGetterTask';
import { RollbitCsGoInventoryGetterTask } from '../InventoryGetter/RollbitCsGoInventoryGetterTask';
import { InventoryFiltererUnit } from '../InventoryFilterer/InventoryFiltererUnit';
import { RollbitInventoryFilterer } from '../InventoryFilterer/RollbitInventoryFilterer';
import { WithdrawMakerTask } from '../WithdrawMaker/WithdrawMakerTask';
import { RollbitCsGoWithdrawMakerTask } from '../WithdrawMaker/RollbitCsGoWithdrawMakerTask';
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
