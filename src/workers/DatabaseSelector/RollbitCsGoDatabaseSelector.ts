import { IWishlistItem } from '../../models/wishlistItem';
import { EnumSteamApp, EnumSite } from '../../helpers/enum';
import WishlistItem = require('../../models/wishlistItem');
import { DatabaseSelectorTask } from "./DatabaseSelectorTask";
export class RollbitCsGoDatabaseSelector extends DatabaseSelectorTask {
  async getWishlistItems(): Promise<IWishlistItem[]> {
    return WishlistItem.default.find({ wishlist_id: this.botUser.wishlist_id, site_id: EnumSite.Rollbit, appid: EnumSteamApp.CsGo }).exec();
  }
}
