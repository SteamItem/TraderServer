import { IRollbitInventoryItem, IRollbitSocketItem } from '../../interfaces/storeItem';
import { EnumBot } from '../../helpers/enum';
import { WorkerBase } from "./WorkerBase";
import { DatabaseSelectorTask } from '../DatabaseSelector/DatabaseSelectorTask';
import { RollbitCsGoDatabaseSelector } from '../DatabaseSelector/RollbitCsGoDatabaseSelector';
import { RollbitInventoryFilterer } from '../InventoryFilterer/RollbitInventoryFilterer';
import { RollbitWithdrawMakerTask } from '../WithdrawMaker/RollbitWithdrawMakerTask';
import { RollbitSocket } from '../../controllers/api/rollbitSocket';
import { IRollbitSocketBalance } from '../../interfaces/profile';
import { IBotParam } from '../../models/botParam';
export class RollbitCsGoWorker extends WorkerBase<IRollbitInventoryItem> {
  private socket: RollbitSocket;
  private syncTimer: NodeJS.Timeout;
  private balance: number;
  initialize() {
    this.socket = new RollbitSocket();
    this.prepareSocketListeners();
  }
  start(botParam: IBotParam): void {
    var that = this;
    that.socket.connect(botParam.cookie);
    that.syncTimer = setInterval(function () {
      that.socket.send('sync', '', botParam.cookie, true);
    }, 2500);
  }
  stop(): void {
    this.socket.disconnect();
    clearInterval(this.syncTimer);
  }
  private prepareSocketListeners() {
    this.prepareSocketBalanceListener();
    this.prepareSocketMarketListener();
  }
  private prepareSocketBalanceListener() {
    var that = this;
    that.socket.listen('balance', (socketBalance: IRollbitSocketBalance) => {
      that.balance = socketBalance.balance / 100;
    });
  }
  private prepareSocketMarketListener() {
    var that = this;
    that.socket.listen('steam/market', async (item: IRollbitSocketItem) => {
      if (item.state === 'listed') {
        await that.inventoryOperation(item);
      }
    })
  }

  getDatabaseSelector(): DatabaseSelectorTask {
    return new RollbitCsGoDatabaseSelector(EnumBot.RollbitCsGo);
  }

  private async inventoryOperation(item: IRollbitSocketItem) {
    try {
      var inventoryFilterer = new RollbitInventoryFilterer(this.balance, [item], this.wishlistItems);
      var currentTask = inventoryFilterer.taskName;
      inventoryFilterer.filter();
      this.handleFilterResult(inventoryFilterer);

      var withdrawMaker = new RollbitWithdrawMakerTask(this.botParam, inventoryFilterer.itemsToBuy, this.logger);
      currentTask = withdrawMaker.taskName;
      await withdrawMaker.work();
      this.handleWithdrawResult(withdrawMaker);
    } catch (e) {
      this.handleError(currentTask, e.message);
    }
  }
}
