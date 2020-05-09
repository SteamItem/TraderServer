import { WorkerTask } from '../Common/WorkerTask';
import { IWithdrawResult } from '../../interfaces/withdraw';
import { LoggerBase } from '../Logger/LoggerBase';
export abstract class WithdrawMakerTask<II> extends WorkerTask {
  taskName = "Withdraw Maker";
  constructor(inventoryItemsToBuy: II[], logger: LoggerBase) {
    super();
    this.$inventoryItemsToBuy = inventoryItemsToBuy;
    this.logger = logger;
  }
  private $inventoryItemsToBuy: II[];
  private $withdrawResult: IWithdrawResult;
  protected logger: LoggerBase;
  public get inventoryItemsToBuy(): II[] {
    return this.$inventoryItemsToBuy;
  }
  public get withdrawResult(): IWithdrawResult {
    return this.$withdrawResult;
  }
  async work() {
    if (!this.inventoryItemsToBuy)
      return Promise.resolve;
    this.$withdrawResult = await this.withdrawAll();
  }
  abstract withdrawAll(): Promise<IWithdrawResult>;
}
