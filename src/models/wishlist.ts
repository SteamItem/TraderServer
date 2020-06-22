import * as mongoose from 'mongoose';

export interface IWishlist {
  name: string;
}

interface IWishlistDocument extends IWishlist, mongoose.Document {}

const WishlistSchema: mongoose.Schema = new mongoose.Schema({
  name: { type: String, required: true },
});

export default mongoose.model<IWishlistDocument>('Wishlist', WishlistSchema);