import * as mongoose from 'mongoose';

export interface IBotUser {
  botid: number;
  name: string;
  worker: boolean;
  cookie: string;
  steam_username?: string;
  wishlist_id?: string;
  code?: string;
}

export interface IBotUserDocument extends mongoose.Document, IBotUser {
}

const BotUserSchema: mongoose.Schema = new mongoose.Schema({
  botid: { type: Number, required: true },
  name: { type: String, required: true },
  worker: { type: Boolean, required: true },
  cookie: { type: String, required: true },
  steam_username: { type: String, required: false },
  wishlist_id: { type: String, required: false },
  code: { type: String, required: false }
});

export default mongoose.model<IBotUserDocument>('BotUser', BotUserSchema);