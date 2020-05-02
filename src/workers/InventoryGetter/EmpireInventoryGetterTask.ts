import axios from 'axios';
import { IEmpireInventoryItem } from '../../interfaces/storeItem';
import { InventoryGetterTask } from './InventoryGetterTask';
export abstract class EmpireInventoryGetterTask<SI extends IEmpireInventoryItem> extends InventoryGetterTask<SI> {
  abstract inventoryUrl: string;
  private get requestConfig() {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': this.botParam.cookie,
        'Host': 'csgoempire.gg'
      }
    };
  }
  async getStoreItems(): Promise<SI[]> {
    try {
      var items = await axios.get<SI[]>(this.inventoryUrl, this.requestConfig);
      return items.data;
    }
    catch (e) {
      this.logger.log(JSON.stringify(e.response.statusText));
    }
  }
}
