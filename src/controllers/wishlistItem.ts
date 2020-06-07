import WishlistItem, { IWishlistItem } from '../models/wishlistItem';

async function findOne(itemId: string): Promise<IWishlistItem> {
    return await WishlistItem.findById(itemId).exec();
}

async function findAll(): Promise<IWishlistItem[]> {
    return await WishlistItem.find({}).exec();
}

async function create(site_id: number, appid: number, name: string, max_price: number): Promise<IWishlistItem> {
    if(!site_id) {
        throw new Error("site_id can not be empty");
    }
    if(!appid) {
        throw new Error("appid can not be empty");
    }
    if(!name) {
        throw new Error("name can not be empty");
    }

    await WishlistItem.findOneAndDelete({ site_id, appid, name }).exec();
    const wishlistItem = new WishlistItem( { site_id, appid, name, max_price });
    return await wishlistItem.save();
}

async function update(itemId: string, site_id: number, appid: number, name: string, max_price: number): Promise<IWishlistItem> {
    if(!itemId) {
        throw new Error("itemId can not be empty");
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
    await WishlistItem.findOneAndDelete({ site_id, appid, name }).exec();
    return await WishlistItem.findByIdAndUpdate(itemId, { site_id, appid, name, max_price }, {new: true}).exec();
}

async function remove(itemId: string): Promise<IWishlistItem> {
    return await WishlistItem.findByIdAndRemove(itemId).exec();
}

export = {
    findOne,
    findAll,
    create,
    update,
    remove
}