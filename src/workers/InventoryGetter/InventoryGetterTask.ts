import { IBotParam } from '../../models/botParam';
import { WorkerTask } from '../Common/WorkerTask';
export abstract class InventoryGetterTask<SI> extends WorkerTask {
  workerJobName = "Inventory Getter";
  abstract inventoryUrl: string;
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
    // TODO: sil
    console.log(`Inventory Count: ${this.$storeItems.length} at ${new Date()}`);
  }
  abstract getStoreItems(): Promise<SI[]>;
}
