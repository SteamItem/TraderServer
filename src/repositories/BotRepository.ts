import { IBotDocument } from './interfaces/IBotDocument';
import BotSchema from "./schemas/BotSchema";
import { RepositoryBase } from "./base/RepositoryBase";
import { EnumBot } from '../helpers/enum';

class BotRepository extends RepositoryBase<IBotDocument> {
  constructor () {
    super(BotSchema);
  }

  findByType(type: EnumBot): Promise<IBotDocument[]> {
    return this._model.find({type}).exec();
  }
}

Object.seal(BotRepository);
export = BotRepository;
