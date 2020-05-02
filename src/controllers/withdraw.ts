import Withdraw = require('../models/withdraw');
import { IItemToBuy } from '../interfaces/itemToBuy';

function create(ib: IItemToBuy) {
    const withdraw = new Withdraw.default({
        bot_id: ib.botEnum,
        name: ib.name,
        price: ib.price,
        max_price: ib.max_price,
        wishlist_item_id: ib.wishlist_item_id
    });
    return withdraw.save();
}

async function findLastTen() {
    return Withdraw.default.find().sort({_id:-1}).limit(10);
}

export = {
    create,
    findLastTen
}