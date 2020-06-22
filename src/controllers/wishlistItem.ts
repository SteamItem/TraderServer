import WishlistItem, { IWishlistItem } from '../models/wishlistItem';

async function findOne(wishlist_id: string, itemId: string): Promise<IWishlistItem> {
    return await WishlistItem.findById(itemId).exec();
}

async function findAll(wishlist_id: string): Promise<IWishlistItem[]> {
    return await WishlistItem.find({wishlist_id}).exec();
}

async function save(wishlist_id: string, site_id: number, appid: number, name: string, max_price: number): Promise<IWishlistItem> {
    if(!wishlist_id) {
        throw new Error("wishlist_id can not be empty");
    }
    if(!site_id) {
        throw new Error("site_id can not be empty");
    }
    if(!appid) {
        throw new Error("appid can not be empty");
    }
    if(!name) {
        throw new Error("name can not be empty");
    }

    await WishlistItem.findOneAndDelete({ site_id, appid, name, wishlist_id }).exec();
    const wishlistItem = new WishlistItem( { site_id, appid, name, max_price, wishlist_id });
    return await wishlistItem.save();
}

async function remove(wishlist_id: string, itemId: string): Promise<IWishlistItem> {
    return await WishlistItem.findByIdAndRemove(itemId).exec();
}

export = {
    findOne,
    findAll,
    save,
    remove
}