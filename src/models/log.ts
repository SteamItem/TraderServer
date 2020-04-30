
import * as mongoose from 'mongoose';

export interface ILog extends mongoose.Document {
  site: string;
  bot: string;
  message: string;
  created_at: Date
}

const LogSchema: mongoose.Schema = new mongoose.Schema({
  site: { type: String },
  bot: { type: String },
  message: { type: String },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model<ILog>('Log', LogSchema);