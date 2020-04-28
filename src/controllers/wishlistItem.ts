import WishlistItem = require('../models/wishlistItem');

async function findOne(itemId: string) {
    return WishlistItem.default.findById(itemId)
}

async function findAll() {
    return WishlistItem.default.find({});
}

async function create(appid: number, name: string, max_price: number) {
    if(!appid) {
        throw new Error("appid can not be empty");
    }
    if(!name) {
        throw new Error("name can not be empty");
    }

    const wishlistItem = new WishlistItem.default( { appid, name, max_price });
    return wishlistItem.save();
}

async function update(itemId: string, appid: number, name: string, max_price: number) {
    if(!itemId) {
        throw new Error("itemId can not be empty");
    }
    if(!appid) {
        throw new Error("appid can not be empty");
    }
    if(!name) {
        throw new Error("name can not be empty");
    }
    return WishlistItem.default.findByIdAndUpdate(itemId, { appid, name, max_price }, {new: true});
}

async function remove(itemId: string) {
    return WishlistItem.default.findByIdAndRemove(itemId);
}

export = {
    findOne,
    findAll,
    create,
    update,
    remove
}