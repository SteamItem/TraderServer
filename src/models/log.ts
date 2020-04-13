
import * as mongoose from 'mongoose';

export interface ILog extends mongoose.Document {
  message: String;
}

const LogSchema: mongoose.Schema = new mongoose.Schema({
  message: { type: String },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model<ILog>('Log', LogSchema);