import csgoController = require('../../controllers/csgo');
import { BalanceCheckerTask } from './BalanceCheckerTask';
export class EmpireBalanceCheckerTask extends BalanceCheckerTask {
  async getBalance() {
    var profile = await csgoController.profile(this.botParam.cookie);
    return profile.balance;
  }
}
