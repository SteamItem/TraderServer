import { IWishlistItemDocument } from "../interfaces/IWishlishItemDocument";

class WishlistItemModel {
  private _model: IWishlistItemDocument;
  constructor(model: IWishlistItemDocument) {
    this._model = model;
  }

  get site_id(): number {
    return this._model.site_id;
  }

  get appid(): number {
    return this._model.appid;
  }

  get name(): string {
    return this._model.name;
  }

  get max_price(): number {
    return this._model.max_price;
  }
}
Object.seal(WishlistItemModel);
export = WishlistItemModel;