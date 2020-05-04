import cron = require('node-cron');
import { EmpireInventoryFilterer } from '../InventoryFilterer/EmpireInventoryFilterer';
import { IEmpireInventoryItem } from '../../interfaces/storeItem';
import { WorkerBase } from "./WorkerBase";
import { BalanceCheckerTask } from '../BalanceChecker/BalanceCheckerTask';
import { EmpireBalanceCheckerTask } from '../BalanceChecker/EmpireBalanceCheckerTask';
import { InventoryFiltererUnit } from '../InventoryFilterer/InventoryFiltererUnit';
import { TokenGetterTask } from '../TokenGetter/TokenGetterTask';
import { EmpireTokenGetterTask } from '../TokenGetter/EmpireTokenGetterTask';
import { WithdrawMakerTask } from '../WithdrawMaker/WithdrawMakerTask';
import { EmpireWithdrawMakerTask } from '../WithdrawMaker/EmpireWithdrawMakerTask';
export abstract class EmpireWorkerBase<II extends IEmpireInventoryItem> extends WorkerBase<II> {
  protected token: string;
  inventoryOperationCronExpression = '*/3 * * * * *';
  getBalanceChecker(): BalanceCheckerTask {
    return new EmpireBalanceCheckerTask(this.botParam);
  }
  getInventoryFilterer(): InventoryFiltererUnit<II> {
    return new EmpireInventoryFilterer(this.balance, this.inventoryItems, this.wishlistItems);
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
    this.balanceChecker();
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
