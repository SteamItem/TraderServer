import * as mongoose from 'mongoose';

export interface PricEmpireItemFamily {
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

export interface PricEmpireItemPrice {
  id: number;
  item_id: number;
  price: number;
  source: string;
  created_at: Date;
}

export interface PricEmpireItemQuantity {
  id: number;
  itemId: number;
  qty: number;
  source: string;
  date: string;
  created_at: Date;
}

export interface IPricEmpireItemDetail extends mongoose.Document {
  id: number;
  market_hash_name: string;
  image: string;
  app_id: number;
  last_price: number;
  buff_id: number;
  skin: string;
  family: PricEmpireItemFamily[];
  exterior: string;
  created_at: Date;
  api_selection_date: Date;
  prices: PricEmpireItemPrice[];
  qty: PricEmpireItemQuantity[];
}

const PricEmpireItemFamilySchema: mongoose.Schema = new mongoose.Schema({
  id: Number,
  market_hash_name: String,
  image: String,
  app_id: Number,
  last_price: Number,
  buff_id: Number,
  skin: String,
  family: String,
  exterior: String,
  created_at: Date
})

const PricEmpireItemPriceSchema: mongoose.Schema = new mongoose.Schema({
  id: Number,
  item_id: Number,
  price: Number,
  source: String,
  created_at: Date
})

const PricEmpireItemQuantitySchema: mongoose.Schema = new mongoose.Schema({
  id: Number,
  itemId: Number,
  qty: Number,
  source: String,
  date: String,
  created_at: Date
});

const PricEmpireItemDetailSchema: mongoose.Schema = new mongoose.Schema({
  id: Number,
  market_hash_name: String,
  image: String,
  app_id: Number,
  last_price: Number,
  buff_id: Number,
  skin: String,
  family: [PricEmpireItemFamilySchema],
  exterior: String,
  created_at: Date,
  api_selection_date: { type: Date, default: Date.now },
  prices: [PricEmpireItemPriceSchema],
  qty: [PricEmpireItemQuantitySchema]
});

export default mongoose.model<IPricEmpireItemDetail>('PricEmpireItemDetail', PricEmpireItemDetailSchema);