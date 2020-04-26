
import * as mongoose from 'mongoose';

export interface IRollbitHistory {
  ref: string;
  price: number;
  markup: number;
  name: string;
  weapon: string;
  skin: string;
  rarity: string;
  exterior: string;
  baseprice: number;
  created_at?: Date;
}

export interface IRollbitHistoryDocument extends mongoose.Document, IRollbitHistory {
}

const RollbitHistorySchema: mongoose.Schema = new mongoose.Schema({
  ref: { type: String },
  price: { type: Number },
  markup: { type: Number },
  name: { type: String },
  weapon: { type: String },
  skin: { type: String },
  rarity: { type: String },
  exterior: { type: String },
  baseprice: { type: String },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model<IRollbitHistoryDocument>('RollbitHistory', RollbitHistorySchema);