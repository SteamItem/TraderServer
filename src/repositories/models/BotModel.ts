import { IBotDocument } from '../interfaces/IBotDocument';

class BotModel {
  private _model: IBotDocument;
  constructor(model: IBotDocument) {
    this._model = model;
  }

  get type(): number {
    return this._model.type;
  }

  get name(): string {
    return this._model.name;
  }

  get worker(): boolean {
    return this._model.worker;
  }

  get cookie(): string {
    return this._model.cookie;
  }

  get code(): string {
    return this._model.code;
  }
}
Object.seal(BotModel);
export = BotModel;