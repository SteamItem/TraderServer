import { BalanceCheckerTask } from './BalanceCheckerTask';
import { CSGOEmpireApi } from '../../api/csgoempire';
export class EmpireBalanceCheckerTask extends BalanceCheckerTask {
  async getBalance() {
    var api = new CSGOEmpireApi();
    var profile = await api.profile(this.botParam.cookie);
    return profile.balance / 100;
  }
}
