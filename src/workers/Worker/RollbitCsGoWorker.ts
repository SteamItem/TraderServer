import cron = require('node-cron');
import { IRollbitInventoryItem, IRollbitSocketItem } from '../../interfaces/storeItem';
import { EnumBot } from '../../helpers/enum';
import { WorkerBase } from "./WorkerBase";
import { DatabaseSelectorTask } from '../DatabaseSelector/DatabaseSelectorTask';
import { RollbitCsGoDatabaseSelector } from '../DatabaseSelector/RollbitCsGoDatabaseSelector';
import { RollbitInventoryFilterer } from '../InventoryFilterer/RollbitInventoryFilterer';
import { RollbitWithdrawMakerTask } from '../WithdrawMaker/RollbitWithdrawMakerTask';
import { RollbitSocket } from '../../api/rollbitSocket';
import { IRollbitSocketBalance } from '../../interfaces/profile';
import { IBotParam } from '../../models/botParam';
export class RollbitCsGoWorker extends WorkerBase<IRollbitInventoryItem> {
  private socket: RollbitSocket;
  private syncTimer: NodeJS.Timeout;
  private scheduledTasks: cron.ScheduledTask[] = [];
  private balance: number;
  private syncReceived = false;
  initialize() {
    this.socket = new RollbitSocket();
    this.prepareSocketListeners();
  }
  start(botParam: IBotParam): void {
    const that = this;
    that.socket.connect(botParam.cookie);
    that.syncTimer = setInterval(() => {
      console.log("sync sent");
      that.socket.send('sync', '', botParam.cookie, true);
    }, 2500);
    const socketRestartScheduler = this.socketRestartScheduler();
    this.scheduledTasks = [socketRestartScheduler]
  }
  stop(): void {
    this.socket.disconnect();
    clearInterval(this.syncTimer);
    this.scheduledTasks.forEach(st => { st.stop(); });
  }
  private socketRestartScheduler() {
    return cron.schedule('* * * * *', async () => {
      const currentTask = "Socket Restarter";
      try {
        if (this.syncReceived) {
          this.syncReceived = false;
          return;
        }
        this.socket.disconnect();
        await this.socket.connect(this.botParam.cookie);
        this.handleMessage(currentTask, "Restarted");
      } catch (e) {
        this.handleError(currentTask, e.message);
      }
    });
  }
  private prepareSocketListeners() {
    this.prepareSocketBalanceListener();
    this.prepareSocketMarketListener();
  }
  private prepareSocketBalanceListener() {
    const that = this;
    const taskName = "Balance";
    that.socket.listen('balance', (socketBalance: IRollbitSocketBalance) => {
      that.balance = socketBalance.balance / 100;
      const type = socketBalance.type || "Initial"
      const message = `Current Balance: ${that.balance} - ${type}`;
      that.handleMessage(taskName, message);
      console.log("Balance: " + that.balance);
    });
  }
  private prepareSocketMarketListener() {
    const that = this;
    that.socket.listen('steam/market', async (item: IRollbitSocketItem) => {
      this.syncReceived = true;
      console.log("new market item" + JSON.stringify(item));
      if (item.state === 'listed') {
        await that.inventoryOperation(item);
      }
    })
  }

  getDatabaseSelector(): DatabaseSelectorTask {
    return new RollbitCsGoDatabaseSelector(EnumBot.RollbitCsGo);
  }

  private async inventoryOperation(item: IRollbitSocketItem) {
    let currentTask = "inventoryOperation";
    try {
      const inventoryFilterer = new RollbitInventoryFilterer(this.balance, [item], this.wishlistItems);
      currentTask = inventoryFilterer.taskName;
      inventoryFilterer.filter();

      const withdrawMaker = new RollbitWithdrawMakerTask(this.botParam, inventoryFilterer.itemsToBuy, this.logger);
      currentTask = withdrawMaker.taskName;
      await withdrawMaker.work();
    } catch (e) {
      this.handleError(currentTask, e.message);
    }
  }
}
