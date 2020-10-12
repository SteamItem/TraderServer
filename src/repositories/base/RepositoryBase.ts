import mongoose = require("mongoose");
import { IRead } from "../interfaces/base/IRead";
import { IWrite } from "../interfaces/base/IWrite";

export class RepositoryBase<T extends mongoose.Document> implements IRead<T>, IWrite<T> {
  protected _model: mongoose.Model<T> ;

  constructor(model: mongoose.Model<T>) {
    this._model = model;
  }

  findAll(): Promise<T[]> {
    return this._model.find().exec();
  }

  findOne(id: string): Promise<T> {
    return this._model.findById(id).exec();
  }

  create(item: T): Promise<T> {
    const entity = new this._model(item);
    return entity.save();
  }

  update(id: string, item: T): Promise<T> {
    return this._model.findByIdAndUpdate(id, item).exec();
  }

  delete(id: string): Promise<T> {
    return this._model.findByIdAndDelete(id).exec();
  }
}