import cron = require('node-cron');
import { IWishlistItem } from '../../models/wishlistItem';
import { IBotParam } from '../../models/botParam';
import { DatabaseSelectorTask } from '../DatabaseSelector/DatabaseSelectorTask';
import { BalanceCheckerTask } from '../BalanceChecker/BalanceCheckerTask';
import { InventoryGetterTask } from '../InventoryGetter/InventoryGetterTask';
import { InventoryFiltererUnit } from '../InventoryFilterer/InventoryFiltererUnit';
import { WithdrawMakerTask } from '../WithdrawMaker/WithdrawMakerTask';
import { LoggerBase } from '../Logger/LoggerBase';
export abstract class WorkerBase<II> {
  constructor(logger: LoggerBase) {
    this.logger = logger;
  }

  protected logger: LoggerBase;
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
      try {
        var databaseSelector = this.getDatabaseSelector();
        var currentTask = databaseSelector.taskName;
        await databaseSelector.work();
        this.botParam = databaseSelector.botParam;
        this.wishlistItems = databaseSelector.wishlistItems;
        this.working = databaseSelector.botParam.worker;
      } catch (e) {
        this.handleError(currentTask, e.message);
      }
    });
  }

  balanceChecker() {
    return cron.schedule('* * * * * *', async () => {
      if (!this.working) return;
      try {
        var balanceChecker = this.getBalanceChecker();
        var currentTask = balanceChecker.taskName;
        await balanceChecker.work();
        this.balance = balanceChecker.balance;
      } catch (e) {
        this.handleError(currentTask, e.message);
      }
    });
  }

  inventoryScheduler() {
    return cron.schedule(this.inventoryOperationCronExpression, async () => {
      if (!this.working) return;
      try {
        var inventoryGetter = this.getInventoryGetter();
        var currentTask = inventoryGetter.taskName;
        await inventoryGetter.work();
        this.inventoryItems = inventoryGetter.inventoryItems;
        var inventoryFilterer = this.getInventoryFilterer();
        currentTask = inventoryFilterer.taskName;
        inventoryFilterer.filter();
        this.handleFilterResult(inventoryFilterer);
        this.itemsToBuy = inventoryFilterer.itemsToBuy;
        var withdrawMaker = this.getWithdrawMaker();
        currentTask = withdrawMaker.taskName;
        await withdrawMaker.work();
        this.handleWithdrawResult(withdrawMaker);
      } catch (e) {
        this.handleError(currentTask, e.message);
      }
    });
  }

  private handleFilterResult(inventoryFilterer: InventoryFiltererUnit<II>) {
    if (inventoryFilterer.wishlistFilteredItems.length > 0) {
      var itemsToBuyLength = inventoryFilterer.itemsToBuy.length;
      var filteredItemsLength = inventoryFilterer.wishlistFilteredItems.length;
      var inventoryItemsLength = this.inventoryItems.length;

      var filterMessage = `${itemsToBuyLength}/${filteredItemsLength}/${inventoryItemsLength} Buy/Filter/All`;
      this.handleMessage(inventoryFilterer.taskName, filterMessage);
    }
  }

  private handleWithdrawResult(withdrawMaker: WithdrawMakerTask<II>) {
    var successWithdrawItemCount = withdrawMaker.withdrawResult.successWithdrawItemCount;
    var failWithdrawItemCount = withdrawMaker.withdrawResult.failWithdrawItemCount;
    var totalWithdrawItemCount = successWithdrawItemCount + failWithdrawItemCount;

    var successWithdrawCount = withdrawMaker.withdrawResult.successWithdrawCount;
    var failWithdrawCount = withdrawMaker.withdrawResult.failWithdrawCount;
    var totalWithdrawCount = successWithdrawCount + failWithdrawCount;

    if (totalWithdrawCount > 0) {
      var message = `${successWithdrawItemCount}/${totalWithdrawItemCount} Items by ${successWithdrawCount}/${totalWithdrawCount} Withdraws made`;
      this.handleMessage(withdrawMaker.taskName, message);
    }
  }

  protected handleMessage(taskName: string, message: string) {
    this.logger.handleMessage(this.botParam.id, taskName, message);
  }

  protected handleError(taskName: string, message: string) {
    this.logger.handleError(this.botParam.id, taskName, message);
  }
}
