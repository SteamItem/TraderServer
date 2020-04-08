const WishlistItem = require('../models/wishlistItem.js');

exports.findAll = async () => {
    var wishlistItems = await WishlistItem.find();
    return wishlistItems;
};

exports.create = async (appid, name, max_price) => {
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

    var data = await wishlistItem.save();
    return data;
};

exports.update = async (itemId, appid, name, max_price) => {
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
    var item = await WishlistItem.findByIdAndUpdate(itemId, { appid, name, max_price }, {new: true});
    return item;
};

exports.delete = async (itemId) => {
    var result = await WishlistItem.findByIdAndRemove(itemId);
    return result
};
