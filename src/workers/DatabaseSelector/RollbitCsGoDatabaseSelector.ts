import { EnumSteamApp, EnumSite } from '../../helpers/enum';
import { DatabaseSelectorTask } from "./DatabaseSelectorTask";
import { IWishlistItem } from '../../interfaces/common';
import { DataApi } from '../../api/data';
export class RollbitCsGoDatabaseSelector extends DatabaseSelectorTask {
  getWishlistItems(): Promise<IWishlistItem[]> {
    const data = new DataApi();
    return data.searchWishlistItems(EnumSite.Rollbit, EnumSteamApp.CsGo);
  }
}
