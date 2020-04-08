const mongoose = require('mongoose');

const WishlistItemSchema = mongoose.Schema({
    appid: Number,
    name: String,
    max_price: Number
}, {
    timestamps: true
});

export = mongoose.model('WishlistItem', WishlistItemSchema);
