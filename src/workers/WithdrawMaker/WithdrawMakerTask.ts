import { WorkerTask } from '../Common/WorkerTask';
import { IWithdrawMakerResult } from '../../interfaces/withdraw';
import { LoggerBase } from '../Logger/LoggerBase';
export abstract class WithdrawMakerTask<II> extends WorkerTask {
  taskName = "Withdraw Maker";
  constructor(inventoryItemsToBuy: II[], logger: LoggerBase) {
    super();
    this.$inventoryItemsToBuy = inventoryItemsToBuy;
    this.logger = logger;
  }
  private $inventoryItemsToBuy: II[];
  private $withdrawResult: IWithdrawMakerResult;
  protected logger: LoggerBase;
  public get inventoryItemsToBuy(): II[] {
    return this.$inventoryItemsToBuy;
  }
  public get withdrawResult(): IWithdrawMakerResult {
    return this.$withdrawResult;
  }
  async work(): Promise<void> {
    if (!this.inventoryItemsToBuy) return;
    this.$withdrawResult = await this.withdrawAll();
  }
  abstract withdrawAll(): Promise<IWithdrawMakerResult>;
}
