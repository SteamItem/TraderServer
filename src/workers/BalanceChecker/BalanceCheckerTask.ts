import { IBotUser } from '../../models/botUser';
import { WorkerTask } from '../Common/WorkerTask';
export abstract class BalanceCheckerTask extends WorkerTask {
  taskName = "Balance Checker";
  constructor(botUser: IBotUser) {
    super();
    this.$botUser = botUser;
  }
  private $botUser: IBotUser;
  public get botUser(): IBotUser {
    return this.$botUser;
  }
  private $balance: number;
  public get balance(): number {
    return this.$balance;
  }
  async work(): Promise<void> {
    this.$balance = await this.getBalance();
  }
  abstract getBalance(): Promise<number>;
}
