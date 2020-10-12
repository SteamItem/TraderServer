import WishlistItemSchema from "./schemas/WishlistItemSchema";
import { RepositoryBase } from "./base/RepositoryBase";
import { IWishlistItemDocument } from "./interfaces/IWishlishItemDocument";

class WishlistItemRepository extends RepositoryBase<IWishlistItemDocument> {
  constructor () {
    super(WishlistItemSchema);
  }
}

Object.seal(WishlistItemRepository);
export = WishlistItemRepository;
