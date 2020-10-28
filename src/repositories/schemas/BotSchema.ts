import mongoose from 'mongoose';
import { IBotDocument } from '../interfaces/IBotDocument';

const BotSchema: mongoose.Schema = new mongoose.Schema({
  type: { type: Number, required: true },
  name: { type: String, required: true },
  worker: { type: Boolean, required: true },
  cookie: { type: String, required: false },
  code: { type: String, required: false }
});

export default mongoose.model<IBotDocument>('Bots', BotSchema);