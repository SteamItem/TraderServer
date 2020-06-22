import cron = require('node-cron');
import { IWishlistItem } from '../../models/wishlistItem';
import { IBotUser } from '../../models/botUser';
import { DatabaseSelectorTask } from '../DatabaseSelector/DatabaseSelectorTask';
import { LoggerBase } from '../Logger/LoggerBase';
import { EnumBot } from '../../helpers/enum';
export abstract class WorkerBase {
  constructor(logger: LoggerBase) {
    this.logger = logger;
  }

  protected logger: LoggerBase;
  protected botUser: IBotUser;
  protected wishlistItems: IWishlistItem[];
  private _working = false;
  private set working(value: boolean) {
    if (this._working === false && value === true) {
      this.start(this.botUser);
    }
    this._working = value;
  }

  abstract bot: EnumBot;
  abstract start(botUser: IBotUser): void;

  abstract getDatabaseSelector(): DatabaseSelectorTask;
  async schedule(): Promise<void> {
    const databaseScheduler = this.databaseScheduler();
    databaseScheduler.start();
  }

  private databaseScheduler() {
    return cron.schedule('* * * * * *', async () => {
      let currentTask = "databaseScheduler";
      try {
        const databaseSelector = this.getDatabaseSelector();
        currentTask = databaseSelector.taskName;
        await databaseSelector.work();
        this.botUser = databaseSelector.botUser;
        this.wishlistItems = databaseSelector.wishlistItems;
        this.working = databaseSelector.botUser.worker;
      } catch (e) {
        this.handleError(currentTask, e.message);
      }
    });
  }

  protected handleMessage(taskName: string, message: string): void {
    this.logger.handleMessage(this.bot, taskName, message);
  }

  protected handleError(taskName: string, message: string): void {
    this.logger.handleError(this.bot, taskName, message);
  }
}
