import { IWishlistItemDocument } from "../repositories/interfaces/IWishlishItemDocument";
import WishlistItemSchema from "../repositories/schemas/WishlistItemSchema";
import WishlistItemRepository from "../repositories/WishlistItemRepository";

export class WishlistItemController {
    private _repository: WishlistItemRepository;

    constructor(repository: WishlistItemRepository) {
        this._repository = repository;
    }

    public findOne(itemId: string): Promise<IWishlistItemDocument> {
        return this._repository.findOne(itemId);
    }

    public findAll(): Promise<IWishlistItemDocument[]> {
        return this._repository.findAll();
    }

    public create(site_id: number, appid: number, name: string, max_price: number): Promise<IWishlistItemDocument> {
        const entity = new WishlistItemSchema({ site_id, appid, name, max_price })
        return this._repository.create(entity);
    }

    public async update(itemId: string, site_id: number, appid: number, name: string, max_price: number): Promise<IWishlistItemDocument> {
        const entity = await this._repository.findOne(itemId);
        entity.site_id = site_id;
        entity.appid = appid;
        entity.name = name;
        entity.max_price = max_price;
        return await this._repository.update(itemId, entity);
    }

    public remove(itemId: string): Promise<IWishlistItemDocument> {
        return this._repository.delete(itemId);
    }
}