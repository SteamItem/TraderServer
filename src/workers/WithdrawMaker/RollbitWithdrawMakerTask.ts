import { IBotParam } from '../../models/botParam';
import { IRollbitInventoryItem } from '../../interfaces/storeItem';
import { WithdrawMakerTask } from './WithdrawMakerTask';
import { RollbitApi } from '../../api/rollbit';
import _ = require('lodash');
import { LoggerBase } from '../Logger/LoggerBase';
import { IWithdrawMakerResult, IWithdrawResult } from '../../interfaces/withdraw';
export class RollbitWithdrawMakerTask<II extends IRollbitInventoryItem> extends WithdrawMakerTask<II> {
  constructor(botParam: IBotParam, itemsToBuy: II[], logger: LoggerBase) {
    super(itemsToBuy, logger);
    this.botParam = botParam;
  }
  private botParam: IBotParam;

  async withdrawAll(): Promise<IWithdrawMakerResult> {
    var promises: Promise<IWithdrawResult>[] = [];
    this.inventoryItemsToBuy.forEach(ib => promises.push(this.withdraw(ib)));
    var results = await Promise.all(promises);

    var successWithdraws = _.filter(results, r => r.status === true);
    var successWithdrawCount = successWithdraws.length;
    var successWithdrawItemCount = _.sumBy(successWithdraws, s => s.count);
    var failWithdraws = _.filter(results, r => r.status === false);
    var failWithdrawCount = failWithdraws.length;
    var failWithdrawItemCount = _.sumBy(failWithdraws, w => w.count);
    return { successWithdrawCount, successWithdrawItemCount, failWithdrawCount, failWithdrawItemCount };
  }

  private async withdraw(ib: IRollbitInventoryItem): Promise<IWithdrawResult> {
    try {
      var api = new RollbitApi();
      await api.withdraw(this.botParam.cookie, [ib.ref]);
      var itemName = ib.items.map(ii => ii.name).join("#");
      this.logger.handleMessage(this.botParam.id, this.taskName, `${itemName} withdrawn for ${ib.price}`);
      return { status: true, count: 1};
    } catch (e) {
      this.logger.handleError(this.botParam.id, this.taskName, e.message);
      return { status: false, count: 1};
    }
  }
}
