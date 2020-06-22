import { IBotUser } from '../../models/botUser';
import { IEmpireInventoryItem } from '../../interfaces/csgoEmpire';
import { WithdrawMakerTask } from './WithdrawMakerTask';
import _ = require('lodash');
import { CSGOEmpireApi } from '../../api/csgoempire';
export class EmpireWithdrawMakerTask<II extends IEmpireInventoryItem> extends WithdrawMakerTask<II> {
  constructor(token: string, botUser: IBotUser, itemsToBuy: II[]) {
    super(itemsToBuy);
    this.token = token;
    this.botUser = botUser;
  }
  private botUser: IBotUser;
  private token: string;

  async withdrawAll(): Promise<void> {
    const promises: Promise<void>[] = [];
    const groupedItems = _.groupBy(this.inventoryItemsToBuy, i => i.bot_id);

    for (const key in groupedItems) {
      const item_ids = _.map(groupedItems[key], i => i.id);
      const promise = this.withdraw(parseInt(key), item_ids);
      promises.push(promise);
    }
    await Promise.all(promises);
  }

  private async withdraw(bot_id: number, item_ids: string[]): Promise<void> {
    const itemCount = item_ids.length;
    try {
      const api = new CSGOEmpireApi();
      await api.withdraw(this.botUser.cookie, this.token, bot_id, item_ids);
      this.successWithdrawResult.push({name: `${itemCount} Items`, price: 0})
    } catch (e) {
      this.failWithdrawResult.push({name: `${itemCount} Items`, price: 0, message: e.message});
    }
  }
}
