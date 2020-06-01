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
  private _working = false;
  private set working(value: boolean) {
    const taskName = "Worker Status";
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
    const databaseScheduler = this.databaseScheduler();
    databaseScheduler.start();
    this.initialize();
  }
  initialize() {}

  private databaseScheduler() {
    return cron.schedule('* * * * * *', async () => {
      let currentTask = "databaseScheduler";
      try {
        const databaseSelector = this.getDatabaseSelector();
        currentTask = databaseSelector.taskName;
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
      const itemsToBuyLength = inventoryFilterer.itemsToBuy.length;
      const filteredItemsLength = inventoryFilterer.wishlistFilteredItems.length;
      const inventoryItemsLength = inventoryFilterer.inventoryItems.length;

      const filterMessage = `${itemsToBuyLength}/${filteredItemsLength}/${inventoryItemsLength} Buy/Filter/All`;
      this.handleMessage(inventoryFilterer.taskName, filterMessage);
    }
  }

  protected handleWithdrawResult(withdrawMaker: WithdrawMakerTask<II>) {
    const successWithdrawItemCount = withdrawMaker.withdrawResult.successWithdrawItemCount;
    const failWithdrawItemCount = withdrawMaker.withdrawResult.failWithdrawItemCount;
    const totalWithdrawItemCount = successWithdrawItemCount + failWithdrawItemCount;

    const successWithdrawCount = withdrawMaker.withdrawResult.successWithdrawCount;
    const failWithdrawCount = withdrawMaker.withdrawResult.failWithdrawCount;
    const totalWithdrawCount = successWithdrawCount + failWithdrawCount;

    if (totalWithdrawCount > 0) {
      const message = `${successWithdrawItemCount}/${totalWithdrawItemCount} Items by ${successWithdrawCount}/${totalWithdrawCount} Withdraws made`;
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
