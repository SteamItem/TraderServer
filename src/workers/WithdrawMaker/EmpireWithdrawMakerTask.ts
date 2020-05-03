import axios from 'axios';
import { IBotParam } from '../../models/botParam';
import { IEmpireInventoryItem } from '../../interfaces/storeItem';
import { WithdrawMakerTask } from './WithdrawMakerTask';
import _ = require('lodash');
export class EmpireWithdrawMakerTask<II extends IEmpireInventoryItem> extends WithdrawMakerTask<II> {
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
    var groupedItems = _.groupBy(this.inventoryItemsToBuy, i => i.bot_id);

    for (var key in groupedItems) {
      var item_ids = _.map(groupedItems[key], i => i.id);
      var promise = this.withdraw(key, item_ids);
      promises.push(promise);
    }
    return await Promise.all(promises);
  }

  private async withdraw(bot_id: string, item_ids: string[]) {
    let data = JSON.stringify({
      "security_token": this.token,
      "bot_id": bot_id,
      "item_ids": item_ids
    });
    var result = await axios.post('https://csgoempire.gg/api/v2/trade/withdraw', data, this.requestConfig);
    return result.data;
  }
}
