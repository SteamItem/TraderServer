import { BalanceCheckerTask } from './BalanceCheckerTask';
export class RollbitBalanceCheckerTask extends BalanceCheckerTask {
  getBalance() {
    return Promise.resolve(10000000);
  }
}
