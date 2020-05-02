import Param = require('../models/botParam');
import { EnumBot } from '../helpers/enum';

async function getBotParam(id: EnumBot) {
  var botParam = await Param.default.findOne({ id }).exec();
  if (!botParam) throw new Error("BotParam not found");
  return botParam;
}

async function getPeriod(id: EnumBot) {
  return (await getBotParam(id)).period;
}

async function getCookie(id: EnumBot) {
  return (await getBotParam(id)).cookie;
}

async function getCode(id: EnumBot) {
  return (await getBotParam(id)).code;
}

async function getWorker(id: EnumBot) {
  return (await getBotParam(id)).worker;
}

async function updatePeriod(id: EnumBot, period: number) {
  return Param.default.findOneAndUpdate({ id }, { period });
}

async function updateCookie(id: EnumBot, cookie: string) {
  return Param.default.findOneAndUpdate({ id }, { cookie });
}

async function updateCode(id: EnumBot, code: string) {
  return Param.default.findOneAndUpdate({ id }, { code });
}

async function updateWorker(id: EnumBot, worker: boolean) {
  return Param.default.findOneAndUpdate({ id }, { worker });
}

export = {
  getBotParam,
  getPeriod,
  getCookie,
  getCode,
  getWorker,
  updatePeriod,
  updateCode,
  updateCookie,
  updateWorker
}