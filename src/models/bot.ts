import * as mongoose from 'mongoose';

export interface IBot {
  id: number;
  name: string;
}

export interface IBotDocument extends mongoose.Document, IBot {
  id: number;
}

const BotSchema: mongoose.Schema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
});

export default mongoose.model<IBotDocument>('Bot', BotSchema);