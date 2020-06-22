import { IWishlistItem } from '../../models/wishlistItem';
import { EnumSite, EnumSteamApp } from '../../helpers/enum';
import WishlistItem = require('../../models/wishlistItem');
import { DatabaseSelectorTask } from "./DatabaseSelectorTask";
export class EmpireDotaDatabaseSelector extends DatabaseSelectorTask {
  async getWishlistItems(): Promise<IWishlistItem[]> {
    return WishlistItem.default.find({ wishlist_id: this.botUser.wishlist_id, site_id: EnumSite.CsGoEmpire, appid: EnumSteamApp.Dota }).exec();
  }
}
