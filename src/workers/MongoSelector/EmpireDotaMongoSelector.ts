import { IWishlistItem } from '../../models/wishlistItem';
import { EnumSite, EnumBot, EnumSteamApp } from '../../helpers/enum';
import WishlistItem = require('../../models/wishlistItem');
import { MongoSelectorTask } from "./MongoSelectorTask";
export class EmpireDotaMongoSelector extends MongoSelectorTask {
  site = EnumSite.CsGoEmpire;
  bot = EnumBot.EmpireDota;
  async getWishlistItems(): Promise<IWishlistItem[]> {
    return WishlistItem.default.find({ site_id: this.site, appid: EnumSteamApp.Dota }).exec();
  }
}
