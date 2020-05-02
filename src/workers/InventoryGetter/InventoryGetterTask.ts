import { IBotParam } from '../../models/botParam';
import { WorkerTask } from '../Common/WorkerTask';
export abstract class InventoryGetterTask<SI> extends WorkerTask {
  workerJobName = "Inventory Getter";
  constructor(botParam: IBotParam) {
    super();
    this.$botParam = botParam;
  }
  private $botParam: IBotParam;
  public get botParam() {
    return this.$botParam;
  }
  private $storeItems: SI[] = [];
  public get inventoryItems(): SI[] {
    return this.$storeItems;
  }
  async work() {
    this.$storeItems = await this.getStoreItems();
  }
  abstract getStoreItems(): Promise<SI[]>;
}
