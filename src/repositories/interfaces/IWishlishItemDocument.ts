import mongoose = require("mongoose");

export interface IWishlistItemDocument extends mongoose.Document {
  site_id: number;
  appid: number;
  name: string;
  max_price?: number;
}