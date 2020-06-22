import Wishlist, { IWishlist } from '../models/wishlist';

async function findAll(): Promise<IWishlist[]> {
    return await Wishlist.find({}).exec();
}

async function findOne(id: string): Promise<IWishlist> {
    return await Wishlist.findById(id).exec();
}

export = {
    findAll,
    findOne
}