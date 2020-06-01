import { BalanceCheckerTask } from './BalanceCheckerTask';
import { CSGOEmpireApi } from '../../api/csgoempire';
export class EmpireBalanceCheckerTask extends BalanceCheckerTask {
  async getBalance() {
    const api = new CSGOEmpireApi();
    const profile = await api.profile(this.botParam.cookie);
    return profile.balance / 100;
  }
}
