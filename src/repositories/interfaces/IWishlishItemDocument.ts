import mongoose = require("mongoose");

export interface IWishlistItemDocument extends mongoose.Document {
  botId: string;
  name: string;
  max_price?: number;
}