import { IWishlistItem } from '../../models/wishlistItem';
import { EnumSite, EnumBot, EnumSteamApp } from '../../helpers/enum';
import WishlistItem = require('../../models/wishlistItem');
import { DatabaseSelectorTask } from "./DatabaseSelectorTask";
export class RollbitCsGoDatabaseSelector extends DatabaseSelectorTask {
  site = EnumSite.Rollbit;
  bot = EnumBot.RollbitCsGo;
  async getWishlistItems(): Promise<IWishlistItem[]> {
    return WishlistItem.default.find({ site_id: this.site, appid: EnumSteamApp.CsGo }).exec();
  }
}
