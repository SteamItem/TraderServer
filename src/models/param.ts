import * as mongoose from 'mongoose';

export interface IParam extends mongoose.Document {
  id: number;
  name: string;
  value: Object;
}

const ParamSchema: mongoose.Schema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  value: { type: Object, required: true }
});

export default mongoose.model<IParam>('Param', ParamSchema);