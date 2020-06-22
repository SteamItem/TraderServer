import Bot, { IBot } from '../models/bot';
import { EnumBot } from '../helpers/enum';

async function findOne(id: EnumBot): Promise<IBot> {
  const botParam = await Bot.findOne({ id }).exec();
  return botParam;
}

export = {
  findOne,
}