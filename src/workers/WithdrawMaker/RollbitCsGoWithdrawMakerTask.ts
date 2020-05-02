import axios from 'axios';
import { EnumSite, EnumBot } from '../../helpers/enum';
import { IBotParam } from '../../models/botParam';
import { IRollbitInventoryItem } from '../../interfaces/storeItem';
import { WithdrawMakerTask } from './WithdrawMakerTask';
export class RollbitCsGoWithdrawMakerTask<II extends IRollbitInventoryItem> extends WithdrawMakerTask<II> {
  site = EnumSite.CsGoEmpire;
  bot = EnumBot.RollbitCsGo;
  constructor(botParam: IBotParam, itemsToBuy: II[]) {
    super(itemsToBuy);
    this.botParam = botParam;
  }
  private botParam: IBotParam;
  private get requestConfig() {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': this.botParam.cookie,
        'Host': 'api.rollbit.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36'
      }
    };
  }

  async withdrawAll() {
    var promises: Promise<any>[] = [];
    this.inventoryItemsToBuy.forEach(ib => promises.push(this.withdraw(ib.ref)));
    return await Promise.all(promises);
  }

  private async withdraw(ref: string) {
    let data = JSON.stringify({
      "refs": [ref]
    });
    var result = await axios.post('https://api.rollbit.com/steam/withdraw', data, this.requestConfig);
    return result.data;
  }
}
