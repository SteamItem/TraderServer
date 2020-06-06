import cron = require('node-cron');
import { IRollbitSocketItem } from '../../interfaces/storeItem';
import { WorkerBase } from "./WorkerBase";
import { DatabaseSelectorTask } from '../DatabaseSelector/DatabaseSelectorTask';
import { RollbitCsGoDatabaseSelector } from '../DatabaseSelector/RollbitCsGoDatabaseSelector';
import { RollbitSocket } from '../../api/rollbitSocket';
import { IRollbitSocketBalance } from '../../interfaces/profile';
import { IBotParam } from '../../models/botParam';
export abstract class RollbitWorkerBase extends WorkerBase {
  private socket: RollbitSocket;
  private syncTimer: NodeJS.Timeout;
  private scheduledTasks: cron.ScheduledTask[] = [];
  private syncReceived = false;
  initialize(): void {
    this.socket = new RollbitSocket();
    this.prepareSocketListeners();
  }
  start(botParam: IBotParam): void {
    this.socket.connect(botParam.cookie);
    this.syncTimer = setInterval(() => {
      console.log("sync sent");
      this.socket.send('sync', '', botParam.cookie, true);
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
    this.socket.listen('balance', (socketBalance: IRollbitSocketBalance) => {
      this.syncReceived = true;
      this.onBalance(socketBalance);
    });
  }
  private prepareSocketMarketListener() {
    this.socket.listen('steam/market', async (item: IRollbitSocketItem) => {
      this.syncReceived = true;
      console.log("new market item" + JSON.stringify(item));
      await this.onSteamMarketItem(item);
    })
  }

  abstract async onSteamMarketItem(item: IRollbitSocketItem): Promise<void>;
  abstract onBalance(_socketBalance: IRollbitSocketBalance): void;

  getDatabaseSelector(): DatabaseSelectorTask {
    return new RollbitCsGoDatabaseSelector(this.bot);
  }
}