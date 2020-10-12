import mongoose = require("mongoose");

export interface IBotDocument extends mongoose.Document {
  type: number;
  name: string;
  worker: boolean;
  cookie: string;
  code?: string;
}