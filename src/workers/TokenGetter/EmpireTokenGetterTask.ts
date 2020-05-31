import { TokenGetterTask } from './TokenGetterTask';
import { CSGOEmpireApi } from '../../api/csgoempire';
export class EmpireTokenGetterTask extends TokenGetterTask {
  async getToken() {
    var code = this.botParam.code;
    if (!code)
      throw new Error("Code not found");
    var api = new CSGOEmpireApi();
    var token = await api.getToken(code, this.botParam.cookie);
    return token.token.toString();
  }
}
