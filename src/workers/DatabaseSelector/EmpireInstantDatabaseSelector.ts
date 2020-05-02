import { IWishlistItem } from '../../models/wishlistItem';
import { EnumSite, EnumBot, EnumSteamApp } from '../../helpers/enum';
import WishlistItem = require('../../models/wishlistItem');
import { DatabaseSelectorTask } from "./DatabaseSelectorTask";
export class EmpireInstantDatabaseSelector extends DatabaseSelectorTask {
  site = EnumSite.CsGoEmpire;
  bot = EnumBot.EmpireInstant;
  async getWishlistItems(): Promise<IWishlistItem[]> {
    return WishlistItem.default.find({ site_id: this.site, appid: EnumSteamApp.CsGo }).exec();
  }
}
