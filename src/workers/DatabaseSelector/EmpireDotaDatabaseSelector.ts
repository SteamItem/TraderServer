import { EnumSite, EnumSteamApp } from '../../helpers/enum';
import { DatabaseSelectorTask } from "./DatabaseSelectorTask";
import { IWishlistItem } from '../../interfaces/common';
import { DataApi } from '../../api/data';
export class EmpireDotaDatabaseSelector extends DatabaseSelectorTask {
  getWishlistItems(): Promise<IWishlistItem[]> {
    const data = new DataApi();
    return data.searchWishlistItems(EnumSite.CsGoEmpire, EnumSteamApp.Dota);
  }
}
