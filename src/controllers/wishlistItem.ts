import WishlistItem = require('../models/wishlistItem');

async function findOne(itemId: string) {
    return await WishlistItem.default.findById(itemId).exec();
}

async function findAll() {
    return await WishlistItem.default.find({}).exec();
}

async function create(site_id: number, appid: number, name: string, max_price: number) {
    if(!site_id) {
        throw new Error("site_id can not be empty");
    }
    if(!appid) {
        throw new Error("appid can not be empty");
    }
    if(!name) {
        throw new Error("name can not be empty");
    }

    await WishlistItem.default.findOneAndDelete({ site_id, appid, name });
    const wishlistItem = new WishlistItem.default( { site_id, appid, name, max_price });
    return await wishlistItem.save();
}

async function update(itemId: string, site_id: number, appid: number, name: string, max_price: number) {
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
    await WishlistItem.default.findOneAndDelete({ site_id, appid, name });
    return await WishlistItem.default.findByIdAndUpdate(itemId, { site_id, appid, name, max_price }, {new: true});
}

async function remove(itemId: string) {
    return await WishlistItem.default.findByIdAndRemove(itemId);
}

export = {
    findOne,
    findAll,
    create,
    update,
    remove
}