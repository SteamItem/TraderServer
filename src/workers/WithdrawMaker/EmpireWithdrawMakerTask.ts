import axios, { AxiosRequestConfig } from 'axios';
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
  private get requestConfig(): AxiosRequestConfig {
    return {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9,tr;q=0.8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json;charset=UTF-8',
        'Cookie': this.botParam.cookie,
        'Host': 'csgoempire.gg',
        'Origin': 'https://csgoempire.gg',
        'pragma': 'no-cache',
        'referer': 'https://csgoempire.gg/withdraw',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36'
      },
      withCredentials: true,
      timeout: 20000,
      maxRedirects: 4
    };
  }

  async withdrawAll() {
    var promises: Promise<any>[] = [];
    var groupedItems = _.groupBy(this.inventoryItemsToBuy, i => i.bot_id);

    for (var key in groupedItems) {
      var item_ids = _.map(groupedItems[key], i => i.id);
      var promise = this.withdraw(parseInt(key), item_ids);
      promises.push(promise);
    }
    return await Promise.all(promises);
  }

  private async withdraw(bot_id: number, item_ids: string[]) {
    let data = JSON.stringify({
      "security_token": this.token,
      "bot_id": bot_id,
      "item_ids": item_ids
    });
    var result = await axios.post('https://csgoempire.gg/api/v2/trade/withdraw', data, this.requestConfig);
    return result.data;
  }
}
