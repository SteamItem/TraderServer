import { IBotParam } from '../../models/botParam';
import { IEmpireInventoryItem } from '../../interfaces/storeItem';
import { WithdrawMakerTask } from './WithdrawMakerTask';
import _ = require('lodash');
import { CSGOEmpireApi } from '../../controllers/api/csgoempire';
import { LoggerBase } from '../Logger/LoggerBase';
export class EmpireWithdrawMakerTask<II extends IEmpireInventoryItem> extends WithdrawMakerTask<II> {
  constructor(token: string, botParam: IBotParam, itemsToBuy: II[], logger: LoggerBase) {
    super(itemsToBuy, logger);
    this.token = token;
    this.botParam = botParam;
  }
  private botParam: IBotParam;
  private token: string;

  async withdrawAll() {
    var promises: Promise<boolean>[] = [];
    var groupedItems = _.groupBy(this.inventoryItemsToBuy, i => i.bot_id);

    for (var key in groupedItems) {
      var item_ids = _.map(groupedItems[key], i => i.id);
      var promise = this.withdraw(parseInt(key), item_ids);
      promises.push(promise);
    }
    var results = await Promise.all(promises);
    var successWithdrawCount = _.filter(results, r => r === true).length;
    var failWithdrawCount = _.filter(results, r => r === false).length;
    return { successWithdrawCount, failWithdrawCount }
  }

  private async withdraw(bot_id: number, item_ids: string[]): Promise<boolean> {
    try {
      var api = new CSGOEmpireApi();
      await api.withdraw(this.botParam.cookie, this.token, bot_id, item_ids);
      return true;
    } catch (e) {
      this.logger.handleError(this.botParam.id, this.taskName, e.message);
      return false;
    }
  }
}
