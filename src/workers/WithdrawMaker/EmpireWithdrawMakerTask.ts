import axios from 'axios';
import { EnumSite } from '../../helpers/enum';
import { IBotParam } from '../../models/botParam';
import { IEmpireInventoryItem } from '../../interfaces/storeItem';
import { LoggerBase } from '../Logger/LoggerBase';
import { WithdrawMakerTask } from './WithdrawMakerTask';
export abstract class EmpireWithdrawMakerTask<II extends IEmpireInventoryItem> extends WithdrawMakerTask<II> {
  site = EnumSite.CsGoEmpire;
  constructor(token: string, botParam: IBotParam, itemsToBuy: II[], logger: LoggerBase) {
    super(itemsToBuy, logger);
    this.token = token;
    this.botParam = botParam;
  }
  private botParam: IBotParam;
  private token: string;
  private get requestConfig() {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': this.botParam.cookie,
        'Host': 'csgoempire.gg'
      }
    };
  }
  async withdrawAll() {
    var promises: Promise<boolean>[] = [];
    this.inventoryItemsToBuy.forEach(ib => promises.push(this.tryToWithdraw(ib)));
    return await Promise.all(promises);
  }
  private async tryToWithdraw(ib: IEmpireInventoryItem) {
    var that = this;
    try {
      await that.withdraw(ib.bot_id, ib.id);
      return true;
    }
    catch (e) {
      that.logger.log(JSON.stringify(e.response.statusText));
      return false;
    }
  }
  private async withdraw(bot_id: number, item_id: string) {
    let data = JSON.stringify({
      "security_token": this.token,
      "bot_id": bot_id,
      "item_ids": [item_id]
    });
    var result = await axios.post('https://csgoempire.gg/api/v2/trade/withdraw', data, this.requestConfig);
    return result.data;
  }
}
