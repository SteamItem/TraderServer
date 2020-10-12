import mongoose from 'mongoose';
import { IWishlistItemDocument } from '../interfaces/IWishlishItemDocument';

const WishlistItemSchema: mongoose.Schema = new mongoose.Schema({
  site_id: { type: Number, required: true },
  appid: { type: Number, required: true },
  name: { type: String, required: true },
  max_price: { type: Number }
});

export default mongoose.model<IWishlistItemDocument>('WishlistItems', WishlistItemSchema);