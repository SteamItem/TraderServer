import { WorkerTask } from '../Common/WorkerTask';
import { IBotParam } from '../../interfaces/common';
export abstract class BalanceCheckerTask extends WorkerTask {
  taskName = "Balance Checker";
  constructor(botParam: IBotParam) {
    super();
    this.$botParam = botParam;
  }
  private $botParam: IBotParam;
  public get botParam(): IBotParam {
    return this.$botParam;
  }
  private $balance: number;
  public get balance(): number {
    return this.$balance;
  }
  async work() {
    this.$balance = await this.getBalance();
  }
  abstract getBalance(): Promise<number>;
}
