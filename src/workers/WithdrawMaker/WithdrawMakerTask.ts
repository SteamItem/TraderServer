import { WorkerTask } from '../Common/WorkerTask';
export abstract class WithdrawMakerTask<II> extends WorkerTask {
  workerJobName = "Withdraw Maker";
  constructor(inventoryItemsToBuy: II[]) {
    super();
    this.$inventoryItemsToBuy = inventoryItemsToBuy;
  }
  private $inventoryItemsToBuy: II[];
  public get inventoryItemsToBuy(): II[] {
    return this.$inventoryItemsToBuy;
  }
  async work() {
    if (!this.inventoryItemsToBuy)
      return Promise.resolve;
    await this.withdrawAll();
  }
  abstract withdrawAll(): Promise<any>;
}
