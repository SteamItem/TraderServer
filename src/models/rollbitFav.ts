
import * as mongoose from 'mongoose';

export interface IRollbitFav {
  name: string;
}

export interface IRollbitFavDocument extends mongoose.Document, IRollbitFav {
}

const RollbitFavSchema: mongoose.Schema = new mongoose.Schema({
  name: { type: String },
});

export default mongoose.model<IRollbitFavDocument>('RollbitFav', RollbitFavSchema);