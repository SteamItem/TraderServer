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

  private logger: LoggerBase;
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
        var currentTask = databaseSelector.workerJobName;
        await databaseSelector.work();
        this.botParam = databaseSelector.botParam;
        this.wishlistItems = databaseSelector.wishlistItems;
        this.working = databaseSelector.botParam.worker;
      } catch (e) {
        this.logger.handleError(this.botParam.id, currentTask, e.message);
      }
    });
  }

  balanceChecker() {
    return cron.schedule('* * * * * *', async () => {
      if (!this.working) return;
      try {
        var balanceChecker = this.getBalanceChecker();
        var currentTask = balanceChecker.workerJobName;
        await balanceChecker.work();
        this.balance = balanceChecker.balance;
      } catch (e) {
        this.logger.handleError(this.botParam.id, currentTask, e.message);
      }
    });
  }

  inventoryScheduler() {
    return cron.schedule(this.inventoryOperationCronExpression, async () => {
      if (!this.working) return;
      try {
        var inventoryGetter = this.getInventoryGetter();
        var currentTask = inventoryGetter.workerJobName;
        await inventoryGetter.work();
        this.inventoryItems = inventoryGetter.inventoryItems;
        var inventoryFilterer = this.getInventoryFilterer();
        currentTask = inventoryFilterer.workerJobName;
        inventoryFilterer.filter();
        this.itemsToBuy = inventoryFilterer.itemsToBuy;
        var withdrawMaker = this.getWithdrawMaker();
        currentTask = withdrawMaker.workerJobName;
        await withdrawMaker.work();
      } catch (e) {
        this.logger.handleError(this.botParam.id, currentTask, e.message);
      }
    });
  }
}
