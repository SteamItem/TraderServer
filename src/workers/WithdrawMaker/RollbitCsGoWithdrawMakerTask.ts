import { IBotParam } from '../../models/botParam';
import { IRollbitInventoryItem } from '../../interfaces/storeItem';
import { WithdrawMakerTask } from './WithdrawMakerTask';
import { RollbitApi } from '../../controllers/api/rollbit';
export class RollbitCsGoWithdrawMakerTask<II extends IRollbitInventoryItem> extends WithdrawMakerTask<II> {
  constructor(botParam: IBotParam, itemsToBuy: II[]) {
    super(itemsToBuy);
    this.botParam = botParam;
  }
  private botParam: IBotParam;

  async withdrawAll() {
    var promises: Promise<any>[] = [];
    this.inventoryItemsToBuy.forEach(ib => promises.push(this.withdraw(ib.ref)));
    return await Promise.all(promises);
  }

  private withdraw(ref: string) {
    var api = new RollbitApi();
    return api.withdraw(this.botParam.cookie, [ref]);
  }
}
