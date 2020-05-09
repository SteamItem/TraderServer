import { IBotParam } from '../../models/botParam';
import { IRollbitInventoryItem } from '../../interfaces/storeItem';
import { WithdrawMakerTask } from './WithdrawMakerTask';
import { RollbitApi } from '../../controllers/api/rollbit';
import _ = require('lodash');
import { LoggerBase } from '../Logger/LoggerBase';
export class RollbitCsGoWithdrawMakerTask<II extends IRollbitInventoryItem> extends WithdrawMakerTask<II> {
  constructor(botParam: IBotParam, itemsToBuy: II[], logger: LoggerBase) {
    super(itemsToBuy, logger);
    this.botParam = botParam;
  }
  private botParam: IBotParam;

  async withdrawAll() {
    var promises: Promise<boolean>[] = [];
    this.inventoryItemsToBuy.forEach(ib => promises.push(this.withdraw(ib.ref)));
    var results = await Promise.all(promises);

    var successWithdrawCount = _.filter(results, r => r === true).length;
    var failWithdrawCount = _.filter(results, r => r === false).length;
    return { successWithdrawCount, failWithdrawCount }
  }

  private async withdraw(ref: string) {
    try {
      var api = new RollbitApi();
      await api.withdraw(this.botParam.cookie, [ref]);
      return true;
    } catch (e) {
      this.logger.handleError(this.botParam.id, this.taskName, JSON.stringify(e));
      return false;
    }
  }
}
