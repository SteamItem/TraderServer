import * as mongoose from 'mongoose';

export interface IPricEmpireItem extends mongoose.Document {
  id: number;
  market_hash_name: string;
  image: string;
  app_id: number;
  last_price: number;
  buff_id: number;
  skin: string;
  family: string;
  exterior: string;
  created_at: Date;
}

const PricEmpireItemSchema: mongoose.Schema = new mongoose.Schema({
  id: Number,
  market_hash_name: String,
  image: String,
  app_id: Number,
  last_price: Number,
  buff_id: Number,
  skin: String,
  family: String,
  exterior: String,
  created_at: Date,
});

export default mongoose.model<IPricEmpireItem>('PricEmpireItem', PricEmpireItemSchema);