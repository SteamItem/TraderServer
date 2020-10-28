import WishlistItemSchema from "./schemas/WishlistItemSchema";
import { RepositoryBase } from "./base/RepositoryBase";
import { IWishlistItemDocument } from "./interfaces/IWishlishItemDocument";

class WishlistItemRepository extends RepositoryBase<IWishlistItemDocument> {
  constructor () {
    super(WishlistItemSchema);
  }

  findByBot(botId: string): Promise<IWishlistItemDocument[]> {
    return this._model.find({botId}).exec();
  }
}

Object.seal(WishlistItemRepository);
export = WishlistItemRepository;
