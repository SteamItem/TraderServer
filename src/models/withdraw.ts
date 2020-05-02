import * as mongoose from 'mongoose';

export interface IWithdraw extends mongoose.Document {
  bot_id: number;
  name: string;
  price: number;
  max_price: number;
  wishlist_item_id: string;
  created_at: Date;
}

const WithdrawSchema: mongoose.Schema = new mongoose.Schema({
  bot_id: { type: Number },
  name: { type: String },
  price: { type: Number },
  max_price: { type: Number },
  wishlist_item_id: { type: String },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model<IWithdraw>('Withdraw', WithdrawSchema);