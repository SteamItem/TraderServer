// import promiseAny = require('promise-any');
import { IBotParam } from '../../models/botParam';
import { IRollbitInventoryItem } from '../../interfaces/rollbit';
import { WithdrawMakerTask } from './WithdrawMakerTask';
import { RollbitApi } from '../../api/rollbit';
export class RollbitWithdrawMakerTask<II extends IRollbitInventoryItem> extends WithdrawMakerTask<II> {
  constructor(botParam: IBotParam, itemsToBuy: II[]) {
    super(itemsToBuy);
    this.botParam = botParam;
  }
  private botParam: IBotParam;

  async withdrawAll(): Promise<void> {
    const promises: Promise<void>[] = [];
    this.inventoryItemsToBuy.forEach(ib => promises.push(this.withdraw(ib)));
    await Promise.all(promises);
  }

  private async withdraw(ib: IRollbitInventoryItem): Promise<void> {
    const itemName = ib.items.map(ii => ii.name).join("#");
    try {
      const api = new RollbitApi();
      // const p1 = api.withdraw(this.botParam.cookie, [ib.ref]);
      // const p2 = api.withdraw(this.botParam.cookie, [ib.ref]);
      // const p3 = api.withdraw(this.botParam.cookie, [ib.ref]);

      // const promises = [p1, p2, p3]
      // await promiseAny(promises);
      await api.withdraw(this.botParam.cookie, [ib.ref]);

      this.successWithdrawResult.push({name: itemName, price: ib.price});
    } catch (e) {
      this.failWithdrawResult.push({name: itemName, price: ib.price, message: e.error})
    }
  }
}
