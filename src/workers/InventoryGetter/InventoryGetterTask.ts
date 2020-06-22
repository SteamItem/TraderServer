import { IBotUser } from '../../models/botUser';
import { WorkerTask } from '../Common/WorkerTask';
export abstract class InventoryGetterTask<SI> extends WorkerTask {
  taskName = "Inventory Getter";
  constructor(botUser: IBotUser) {
    super();
    this.$botUser = botUser;
  }
  private $botUser: IBotUser;
  public get botUser(): IBotUser {
    return this.$botUser;
  }
  private $storeItems: SI[] = [];
  public get inventoryItems(): SI[] {
    return this.$storeItems;
  }
  async work(): Promise<void> {
    this.$storeItems = await this.getStoreItems();
  }
  abstract getStoreItems(): Promise<SI[]>;
}
