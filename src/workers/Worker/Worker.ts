import cron = require('node-cron');
import { IWishlistItem } from '../../models/wishlistItem';
import { IBotParam } from '../../models/botParam';
import { LoggerBase } from '../Logger/LoggerBase';
import { DatabaseSelectorTask } from '../DatabaseSelector/DatabaseSelectorTask';
import { TokenGetterTask } from '../TokenGetter/TokenGetterTask';
import { InventoryFilterer } from '../Filterer/InventoryFilterer';
import { InventoryGetterTask } from '../InventoryGetter/InventoryGetterTask';
import { WithdrawMakerTask } from '../WithdrawMaker/WithdrawMakerTask';
export abstract class Worker<II> {
  constructor(logger: LoggerBase) {
    this.logger = logger;
  }
  protected logger: LoggerBase;
  protected working = false;
  protected botParam: IBotParam;
  protected wishlistItems: IWishlistItem[];
  protected token: string;
  protected inventoryItems: II[] = [];
  protected itemsToBuy: II[] = [];
  abstract getMongoSelector(): DatabaseSelectorTask;
  abstract getTokenGetter(): TokenGetterTask;
  abstract getInventoryGetter(): InventoryGetterTask<II>;
  abstract getWithdrawMaker(): WithdrawMakerTask<II>;
  abstract getInventoryFilterer(): InventoryFilterer<II>;
  abstract inventoryOperationCronExpression: string
  /**
   * work
   */
  public work() {
    cron.schedule('* * * * * *', async () => {
      var mongoSelector = this.getMongoSelector();
      await mongoSelector.work();
      this.botParam = mongoSelector.botParam;
      this.wishlistItems = mongoSelector.wishlistItems;
      this.working = mongoSelector.botParam.worker;
    });
    cron.schedule('* * * * * *', async () => {
      if (!this.working)
        return;
      var tokenGetter = this.getTokenGetter();
      await tokenGetter.work();
      this.token = tokenGetter.token;
    });
    cron.schedule(this.inventoryOperationCronExpression, async () => {
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
