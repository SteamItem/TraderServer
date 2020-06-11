import { RollbitInventoryFilterer } from '../InventoryFilterer/RollbitInventoryFilterer';
import { RollbitWithdrawMakerTask } from '../WithdrawMaker/RollbitWithdrawMakerTask';
import { RollbitWorkerBase } from './RollbitWorkerBase';
import { EnumBot } from '../../helpers/enum';
import { IRollbitSocketItem, IRollbitSocketBalance } from '../../interfaces/rollbit';
import helpers from '../../helpers';
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
    // const newItemDate = new Date();
    try {
      const inventoryFilterer = new RollbitInventoryFilterer(this.balance, [item], this.wishlistItems);
      currentTask = inventoryFilterer.taskName;
      inventoryFilterer.filter();

      // const afterFilterDate = new Date();

      await helpers.sleep(250);
      const withdrawMaker = new RollbitWithdrawMakerTask(this.botParam, inventoryFilterer.itemsToBuy, this.logger);
      currentTask = withdrawMaker.taskName;
      await withdrawMaker.work();

      // const afterWithdrawDate = new Date();
      // const filterTime = afterFilterDate.getTime() - newItemDate.getTime();
      // const withdrawTime = afterWithdrawDate.getTime() - afterFilterDate.getTime();
      // const totalTime = afterWithdrawDate.getTime() - newItemDate.getTime();
      // const message = `${item.items[0].name} - Filter time: ${filterTime} ms, Withdraw time: ${withdrawTime} ms, Total time: ${totalTime} ms`;
      // this.handleMessage("Inventory Operation", message);
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
