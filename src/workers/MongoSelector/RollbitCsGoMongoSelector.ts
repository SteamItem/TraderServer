import { IWishlistItem } from '../../models/wishlistItem';
import { EnumSite, EnumBot, EnumSteamApp } from '../../helpers/enum';
import WishlistItem = require('../../models/wishlistItem');
import { MongoSelectorTask } from "./MongoSelectorTask";
export class RollbitCsGoMongoSelector extends MongoSelectorTask {
  site = EnumSite.Rollbit;
  bot = EnumBot.RollbitCsGo;
  async getWishlistItems(): Promise<IWishlistItem[]> {
    return WishlistItem.default.find({ site_id: this.site, appid: EnumSteamApp.CsGo }).exec();
  }
}
