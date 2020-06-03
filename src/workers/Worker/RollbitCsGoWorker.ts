import { IRollbitSocketItem } from '../../interfaces/storeItem';
import { RollbitInventoryFilterer } from '../InventoryFilterer/RollbitInventoryFilterer';
import { RollbitWithdrawMakerTask } from '../WithdrawMaker/RollbitWithdrawMakerTask';
import { RollbitWorkerBase } from './RollbitWorkerBase';
import { IRollbitSocketBalance } from '../../interfaces/profile';
import { EnumBot } from '../../helpers/enum';
export class RollbitCsGoWorker extends RollbitWorkerBase {
  bot = EnumBot.RollbitCsGo;
  private balance: number;

  async onSteamMarketItem(item: IRollbitSocketItem): Promise<void> {
    if (item.state === 'listed') {
      await this.inventoryOperation(item);
    }
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

  onBalance(socketBalance: IRollbitSocketBalance): void {
    this.balance = socketBalance.balance / 100;
    const type = socketBalance.type || "Initial"
    const message = `Current Balance: ${this.balance} - ${type}`;
    this.handleMessage("Balance", message);
  }
}
