import cron = require('node-cron');
import { TokenGetterTask, EmpireTokenGetterTask } from '../TokenGetter';
import { InventoryFilterer, EmpireFilterer } from '../Filterer';
import { WithdrawMakerTask, EmpireWithdrawMakerTask } from '../WithdrawMaker';
import { IEmpireInventoryItem } from '../../interfaces/storeItem';
import { WorkerBase } from "./WorkerBase";
export abstract class EmpireWorkerBase<II extends IEmpireInventoryItem> extends WorkerBase<II> {
  protected token: string;
  inventoryOperationCronExpression = '*/3 * * * * *';
  getInventoryFilterer(): InventoryFilterer<II> {
    return new EmpireFilterer(this.inventoryItems, this.wishlistItems);
  }
  getTokenGetter(): TokenGetterTask {
    return new EmpireTokenGetterTask(this.botParam);
  }
  getWithdrawMaker(): WithdrawMakerTask<II> {
    return new EmpireWithdrawMakerTask(this.token, this.botParam, this.itemsToBuy);
  }
  async schedule() {
    this.databaseScheduler();
    this.tokenScheduler();
    this.inventoryScheduler();
  }
  private tokenScheduler() {
    return cron.schedule('* * * * * *', async () => {
      if (!this.working)
        return;
      var tokenGetter = this.getTokenGetter();
      await tokenGetter.work();
      this.token = tokenGetter.token;
    });
  }
}
