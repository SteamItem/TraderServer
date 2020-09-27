import { WithdrawMakerTask } from './WithdrawMakerTask';
import { DuelbitsSocket } from '../../api/duelbitsSocket';
import { IDuelbitsListing } from '../../interfaces/duelbits';
import _ from 'lodash';
export class DuelbitsWithdrawMakerTask<II extends IDuelbitsListing> extends WithdrawMakerTask<II> {
  constructor(socket: DuelbitsSocket, itemsToBuy: II[]) {
    super(itemsToBuy);
    this.socket = socket;
  }
  private socket: DuelbitsSocket;

  async withdrawAll(): Promise<void> {
    const promises: Promise<void>[] = [];
    this.inventoryItemsToBuy.forEach(ib => promises.push(this.withdraw(ib)));
    await Promise.all(promises);
  }

  private async withdraw(ib: IDuelbitsListing): Promise<void> {
    const name = ib.items.map(ii => ii.name).join("#");
    const price = _.sumBy(ib.items, ii => ii.price);
    this.socket.withdraw(ib.id, (e: Error) => {
      if (e) {
        this.$failWithdrawResult.push({name, price, message: e.message});
      } else {
        this.$successWithdrawResult.push({name, price});
      }
    });
  }
}
