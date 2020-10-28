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

    public findByBot(botId: string): Promise<IWishlistItemDocument[]> {
        return this._repository.findByBot(botId);
    }

    public create(botId: string, name: string, max_price: number): Promise<IWishlistItemDocument> {
        const entity = new WishlistItemSchema({ botId, name, max_price })
        return this._repository.create(entity);
    }

    public async update(botId: string, itemId: string, name: string, max_price: number): Promise<IWishlistItemDocument> {
        const entity = await this._repository.findOne(itemId);
        entity.name = name;
        entity.max_price = max_price;
        return await this._repository.update(itemId, entity);
    }

    public remove(itemId: string): Promise<IWishlistItemDocument> {
        return this._repository.delete(itemId);
    }
}