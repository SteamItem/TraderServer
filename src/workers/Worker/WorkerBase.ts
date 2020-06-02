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

  protected handleMessage(taskName: string, message: string) {
    this.logger.handleMessage(this.botParam.id, taskName, message);
  }

  protected handleError(taskName: string, message: string) {
    this.logger.handleError(this.botParam.id, taskName, message);
  }
}
