import { BalanceCheckerTask } from './BalanceCheckerTask';
export class RollbitBalanceCheckerTask extends BalanceCheckerTask {
  getBalance() {
    // TODO: Workaround fix
    return Promise.resolve(10000000);
  }
}
