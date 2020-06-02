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
    const promises: Promise<IWithdrawResult>[] = [];
    this.inventoryItemsToBuy.forEach(ib => promises.push(this.withdraw(ib)));
    const results = await Promise.all(promises);

    const successWithdraws = _.filter(results, r => r.status === true);
    const successWithdrawCount = successWithdraws.length;
    const successWithdrawItemCount = _.sumBy(successWithdraws, s => s.count);
    const failWithdraws = _.filter(results, r => r.status === false);
    const failWithdrawCount = failWithdraws.length;
    const failWithdrawItemCount = _.sumBy(failWithdraws, w => w.count);
    return { successWithdrawCount, successWithdrawItemCount, failWithdrawCount, failWithdrawItemCount };
  }

  private async withdraw(ib: IRollbitInventoryItem): Promise<IWithdrawResult> {
    const itemName = ib.items.map(ii => ii.name).join("#");
    try {
      const api = new RollbitApi();
      await api.withdraw(this.botParam.cookie, [ib.ref]);
      this.logger.handleMessage(this.botParam.id, this.taskName, `${itemName} withdrawn for ${ib.price}`);
      return { status: true, count: 1};
    } catch (e) {
      this.logger.handleError(this.botParam.id, this.taskName, `${itemName} withdraw failed ${ib.price} - ${e.message}`);
      return { status: false, count: 1};
    }
  }
}
