
import * as mongoose from 'mongoose';

export interface IWishlistItem extends mongoose.Document {
  appid: number;
  name: string;
  max_price: number;
}

const WishlistItemSchema: mongoose.Schema = new mongoose.Schema({
  appid: { type: Number, required: true },
  name: { type: String, required: true },
  max_price: { type: Number, required: true }
});

export default mongoose.model<IWishlistItem>('WishlistItem', WishlistItemSchema);