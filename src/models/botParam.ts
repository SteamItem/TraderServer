import * as mongoose from 'mongoose';

export interface IBotParam extends mongoose.Document {
  id: number;
  name: string;
  period: number;
  worker: boolean;
  cookie: string;
  code?: string;
}

const BotParamSchema: mongoose.Schema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  period: { type: Number, required: true },
  worker: { type: Boolean, required: true },
  cookie: { type: String, required: true },
  code: { type: Number, required: false }
});

export default mongoose.model<IBotParam>('BotParam', BotParamSchema);