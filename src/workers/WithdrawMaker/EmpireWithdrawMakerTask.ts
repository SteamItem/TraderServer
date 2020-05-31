import { IBotParam } from '../../models/botParam';
import { IEmpireInventoryItem } from '../../interfaces/storeItem';
import { WithdrawMakerTask } from './WithdrawMakerTask';
import _ = require('lodash');
import { CSGOEmpireApi } from '../../api/csgoempire';
import { LoggerBase } from '../Logger/LoggerBase';
import { IWithdrawResult, IWithdrawMakerResult } from '../../interfaces/withdraw';
export class EmpireWithdrawMakerTask<II extends IEmpireInventoryItem> extends WithdrawMakerTask<II> {
  constructor(token: string, botParam: IBotParam, itemsToBuy: II[], logger: LoggerBase) {
    super(itemsToBuy, logger);
    this.token = token;
    this.botParam = botParam;
  }
  private botParam: IBotParam;
  private token: string;

  async withdrawAll(): Promise<IWithdrawMakerResult> {
    var promises: Promise<IWithdrawResult>[] = [];
    var groupedItems = _.groupBy(this.inventoryItemsToBuy, i => i.bot_id);

    for (var key in groupedItems) {
      var item_ids = _.map(groupedItems[key], i => i.id);
      var promise = this.withdraw(parseInt(key), item_ids);
      promises.push(promise);
    }
    var results = await Promise.all(promises);
    var successWithdraws = _.filter(results, r => r.status === true);
    var successWithdrawCount = successWithdraws.length;
    var successWithdrawItemCount = _.sumBy(successWithdraws, s => s.count);
    var failWithdraws = _.filter(results, r => r.status === false);
    var failWithdrawCount = failWithdraws.length;
    var failWithdrawItemCount = _.sumBy(failWithdraws, w => w.count);
    return { successWithdrawCount, successWithdrawItemCount, failWithdrawCount, failWithdrawItemCount };
  }

  private async withdraw(bot_id: number, item_ids: string[]): Promise<IWithdrawResult> {
    try {
      var api = new CSGOEmpireApi();
      await api.withdraw(this.botParam.cookie, this.token, bot_id, item_ids);
      return { status: true, count: item_ids.length };
    } catch (e) {
      this.logger.handleError(this.botParam.id, this.taskName, e.message);
      return { status: false, count: item_ids.length };
    }
  }
}
