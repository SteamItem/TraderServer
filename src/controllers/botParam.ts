import BotParam = require('../models/botParam');
import { EnumBot } from '../helpers/enum';

async function findOne(id: EnumBot) {
  var botParam = await BotParam.default.findOne({ id }).exec();
  if (!botParam) throw new Error("BotParam not found");
  return botParam;
}

async function update(id: number, worker: boolean, code: string, cookie: string) {
  if(!cookie) {
    throw new Error("cookie can not be empty");
  }
  return BotParam.default.findOneAndUpdate({ id }, { worker, code, cookie }, {new: true});
}

export = {
  findOne,
  update
}