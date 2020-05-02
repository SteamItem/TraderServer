import csgoController = require('../../controllers/csgo');
import { EnumSite } from '../../helpers/enum';
import { TokenGetterTask } from './TokenGetterTask';
export abstract class EmpireTokenGetterTask extends TokenGetterTask {
  site = EnumSite.CsGoEmpire;
  async getToken() {
    var code = this.botParam.code;
    if (!code)
      throw new Error("Code not found");
    var token = await csgoController.getToken(code, this.botParam.cookie);
    return token.token.toString();
  }
}
