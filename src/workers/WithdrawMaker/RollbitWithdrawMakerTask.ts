import { IBotUser } from '../../models/botUser';
import { IRollbitInventoryItem } from '../../interfaces/rollbit';
import { WithdrawMakerTask } from './WithdrawMakerTask';
import { RollbitApi } from '../../api/rollbit';
export class RollbitWithdrawMakerTask<II extends IRollbitInventoryItem> extends WithdrawMakerTask<II> {
  constructor(api: RollbitApi, botUser: IBotUser, itemsToBuy: II[]) {
    super(itemsToBuy);
    this.api = api;
    this.botUser = botUser;
  }
  private api: RollbitApi;
  private botUser: IBotUser;

  async withdrawAll(): Promise<void> {
    const promises: Promise<void>[] = [];
    this.inventoryItemsToBuy.forEach(ib => promises.push(this.withdraw(ib)));
    await Promise.all(promises);
  }

  private async withdraw(ib: IRollbitInventoryItem): Promise<void> {
    const itemName = ib.items.map(ii => ii.name).join("#");
    try {
      await this.api.withdraw(this.botUser.cookie, [ib.ref]);
      this.$successWithdrawResult.push({name: itemName, price: ib.price});
    } catch (e) {
      this.$failWithdrawResult.push({name: itemName, price: ib.price, message: e.message})
    }
  }
}
