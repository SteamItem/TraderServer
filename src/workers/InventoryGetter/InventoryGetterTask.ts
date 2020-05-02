import { IBotParam } from '../../models/botParam';
import { LoggerBase } from '../Logger/LoggerBase';
import { WorkerTask } from '../Common/WorkerTask';
export abstract class InventoryGetterTask<SI> extends WorkerTask {
  constructor(botParam: IBotParam, logger: LoggerBase) {
    super(logger);
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
