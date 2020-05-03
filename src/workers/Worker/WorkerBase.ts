import cron = require('node-cron');
import { IWishlistItem } from '../../models/wishlistItem';
import { IBotParam } from '../../models/botParam';
import { DatabaseSelectorTask } from '../DatabaseSelector';
import { InventoryFiltererUnit } from '../InventoryFilterer';
import { InventoryGetterTask } from '../InventoryGetter';
import { WithdrawMakerTask } from '../WithdrawMaker';
import { BalanceCheckerTask } from '../BalanceChecker';
export abstract class WorkerBase<II> {
  protected botParam: IBotParam;
  protected wishlistItems: IWishlistItem[];
  protected inventoryItems: II[] = [];
  protected balance: number;
  protected itemsToBuy: II[] = [];
  protected working: boolean = false;

  abstract getDatabaseSelector(): DatabaseSelectorTask;
  abstract getBalanceChecker(): BalanceCheckerTask;
  abstract getInventoryGetter(): InventoryGetterTask<II>;
  abstract getInventoryFilterer(): InventoryFiltererUnit<II>;
  abstract getWithdrawMaker(): WithdrawMakerTask<II>;
  abstract get inventoryOperationCronExpression(): string;
  abstract schedule(): Promise<any>;

  databaseScheduler() {
    return cron.schedule('* * * * * *', async () => {
      var databaseSelector = this.getDatabaseSelector();
      await databaseSelector.work();
      this.botParam = databaseSelector.botParam;
      this.wishlistItems = databaseSelector.wishlistItems;
      this.working = databaseSelector.botParam.worker;
    });
  }

  balanceChecker() {
    return cron.schedule('* * * * * *', async () => {
      if (!this.working)
        return;
      var balanceChecker = this.getBalanceChecker();
      await balanceChecker.work();
      this.balance = balanceChecker.balance;
    });
  }

  inventoryScheduler() {
    return cron.schedule(this.inventoryOperationCronExpression, async () => {
      if (!this.working)
        return;
      var inventoryGetter = this.getInventoryGetter();
      await inventoryGetter.work();
      this.inventoryItems = inventoryGetter.inventoryItems;
      var inventoryFilterer = this.getInventoryFilterer();
      inventoryFilterer.filter();
      this.itemsToBuy = inventoryFilterer.itemsToBuy;
      var withdrawMaker = this.getWithdrawMaker();
      await withdrawMaker.work();
    });
  }
}
