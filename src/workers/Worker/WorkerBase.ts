import cron = require('node-cron');
import { IWishlistItem } from '../../models/wishlistItem';
import { IBotParam } from '../../models/botParam';
import { DatabaseSelectorTask } from '../DatabaseSelector/DatabaseSelectorTask';
import { LoggerBase } from '../Logger/LoggerBase';
import { InventoryFiltererUnit } from '../InventoryFilterer/InventoryFiltererUnit';
import { WithdrawMakerTask } from '../WithdrawMaker/WithdrawMakerTask';
export abstract class WorkerBase<II> {
  constructor(logger: LoggerBase) {
    this.logger = logger;
  }

  protected logger: LoggerBase;
  protected botParam: IBotParam;
  protected wishlistItems: IWishlistItem[];
  private _working: boolean = false;
  private set working(value: boolean) {
    var taskName = "Worker Status";
    if (this._working === true && value === false) {
      this.stop();
      this.logger.handleMessage(this.botParam.id, taskName, "Stopped");
    } else if (this._working === false && value === true) {
      this.start(this.botParam);
      this.logger.handleMessage(this.botParam.id, taskName, "Started");
    }
    this._working = value;
  }

  abstract start(botParam: IBotParam): void;
  abstract stop(): void;

  abstract getDatabaseSelector(): DatabaseSelectorTask;
  async schedule() {
    var databaseScheduler = this.databaseScheduler();
    databaseScheduler.start();
    this.initialize();
  }
  initialize() {}

  private databaseScheduler() {
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

  protected handleFilterResult(inventoryFilterer: InventoryFiltererUnit<II>) {
    if (inventoryFilterer.wishlistFilteredItems.length > 0) {
      var itemsToBuyLength = inventoryFilterer.itemsToBuy.length;
      var filteredItemsLength = inventoryFilterer.wishlistFilteredItems.length;
      var inventoryItemsLength = inventoryFilterer.inventoryItems.length;

      var filterMessage = `${itemsToBuyLength}/${filteredItemsLength}/${inventoryItemsLength} Buy/Filter/All`;
      this.handleMessage(inventoryFilterer.taskName, filterMessage);
    }
  }

  protected handleWithdrawResult(withdrawMaker: WithdrawMakerTask<II>) {
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
