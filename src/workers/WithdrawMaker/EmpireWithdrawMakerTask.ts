import axios from 'axios';
import { EnumSite } from '../../helpers/enum';
import { IBotParam } from '../../models/botParam';
import { IEmpireInventoryItem } from '../../interfaces/storeItem';
import { WithdrawMakerTask } from './WithdrawMakerTask';
export abstract class EmpireWithdrawMakerTask<II extends IEmpireInventoryItem> extends WithdrawMakerTask<II> {
  site = EnumSite.CsGoEmpire;
  workerJobName = "Withdraw Maker";
  constructor(token: string, botParam: IBotParam, itemsToBuy: II[]) {
    super(itemsToBuy);
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
    var promises: Promise<any>[] = [];
    this.inventoryItemsToBuy.forEach(ib => promises.push(this.withdraw(ib.bot_id, ib.id)));
    return await Promise.all(promises);
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
