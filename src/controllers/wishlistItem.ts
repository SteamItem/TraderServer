import WishlistItem = require('../models/wishlistItem');

function findAll() {
    return WishlistItem.find();
};

function create(appid, name, max_price) {
    if(!appid) {
        throw new Error("appid can not be empty");
    }
    if(!name) {
        throw new Error("name can not be empty");
    }
    if(!max_price) {
        throw new Error("max_price can not be empty");
    }

    const wishlistItem = new WishlistItem( { appid, name, max_price });

    return wishlistItem.save();
};

function update(itemId, appid, name, max_price) {
    if(!itemId) {
        throw new Error("itemId can not be empty");
    }
    if(!appid) {
        throw new Error("appid can not be empty");
    }
    if(!name) {
        throw new Error("name can not be empty");
    }
    if(!max_price) {
        throw new Error("max_price can not be empty");
    }
    return WishlistItem.findByIdAndUpdate(itemId, { appid, name, max_price }, {new: true});
};

function remove(itemId) {
    return WishlistItem.findByIdAndRemove(itemId);
};

export = {
    findAll,
    create,
    update,
    remove
}