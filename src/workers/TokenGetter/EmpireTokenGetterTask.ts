import csgoController = require('../../controllers/csgo');
import { TokenGetterTask } from './TokenGetterTask';
export class EmpireTokenGetterTask extends TokenGetterTask {
  async getToken() {
    var code = this.botParam.code;
    if (!code)
      throw new Error("Code not found");
    var token = await csgoController.getToken(code, this.botParam.cookie);
    return token.token.toString();
  }
}
