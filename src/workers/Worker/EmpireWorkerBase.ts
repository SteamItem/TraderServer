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
import { InventoryGetterTask } from '../InventoryGetter/InventoryGetterTask';
export abstract class EmpireWorkerBase<II extends IEmpireInventoryItem> extends WorkerBase<II> {
  protected token: string;
  protected inventoryItems: II[] = [];
  protected balance: number;
  protected itemsToBuy: II[] = [];
  abstract getInventoryGetter(): InventoryGetterTask<II>;
  private scheduledTasks: cron.ScheduledTask[] = [];
  private inventoryTimer: NodeJS.Timeout;
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
    return new EmpireWithdrawMakerTask(this.token, this.botParam, this.itemsToBuy, this.logger);
  }
  start() {
    const that = this;
    const tokenScheduler = that.tokenScheduler();
    const balanceChecker = that.balanceChecker();
    that.scheduledTasks = [tokenScheduler, balanceChecker];
    that.scheduledTasks.forEach(st => { st.start(); });
    that.inventoryTimer = setInterval(() => {
      that.inventoryTask();
    }, 250);
  }
  stop() {
    this.scheduledTasks.forEach(st => { st.stop(); });
    clearInterval(this.inventoryTimer);
  }
  private tokenScheduler() {
    return cron.schedule('* * * * * *', async () => {
      let currentTask = "tokenScheduler";
      try {
        const tokenGetter = this.getTokenGetter();
        currentTask = tokenGetter.taskName;
        await tokenGetter.work();
        this.token = tokenGetter.token;
      } catch (e) {
        this.handleError(currentTask, e.message);
      }
    });
  }

  balanceChecker() {
    return cron.schedule('* * * * * *', async () => {
      let currentTask = "balanceChecker";
      try {
        const balanceChecker = this.getBalanceChecker();
        currentTask = balanceChecker.taskName;
        await balanceChecker.work();
        this.balance = balanceChecker.balance;
      } catch (e) {
        this.handleError(currentTask, e.message);
      }
    });
  }

  private async inventoryTask() {
    let currentTask = "inventoryTask";
    try {
      const inventoryGetter = this.getInventoryGetter();
      currentTask = inventoryGetter.taskName;
      await inventoryGetter.work();
      this.inventoryItems = inventoryGetter.inventoryItems;
      const inventoryFilterer = this.getInventoryFilterer();
      currentTask = inventoryFilterer.taskName;
      inventoryFilterer.filter();
      this.itemsToBuy = inventoryFilterer.itemsToBuy;
      const withdrawMaker = this.getWithdrawMaker();
      currentTask = withdrawMaker.taskName;
      await withdrawMaker.work();
    } catch (e) {
      this.handleError(currentTask, e.message);
    }
  }
}
