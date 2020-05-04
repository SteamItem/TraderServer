import { IBotParam } from '../../models/botParam';
import { IEmpireInventoryItem } from '../../interfaces/storeItem';
import { WithdrawMakerTask } from './WithdrawMakerTask';
import _ = require('lodash');
import { CSGOEmpireApi } from '../../controllers/api/csgoempire';
export class EmpireWithdrawMakerTask<II extends IEmpireInventoryItem> extends WithdrawMakerTask<II> {
  constructor(token: string, botParam: IBotParam, itemsToBuy: II[]) {
    super(itemsToBuy);
    this.token = token;
    this.botParam = botParam;
  }
  private botParam: IBotParam;
  private token: string;

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
    var api = new CSGOEmpireApi();
    return api.withdraw(this.botParam.cookie, this.token, bot_id, item_ids);
  }
}
