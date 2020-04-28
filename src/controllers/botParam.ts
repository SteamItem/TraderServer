import Param = require('../models/botParam');
import { botEnum } from '../helpers/enum';

async function getBotParam(id: botEnum) {
  var botParam = await Param.default.findOne({ id }).exec();
  if (!botParam) throw new Error("BotParam not found");
  return botParam;
}

async function getPeriod(id: botEnum) {
  return (await getBotParam(id)).period;
}

async function getCookie(id: botEnum) {
  return (await getBotParam(id)).cookie;
}

async function getCode(id: botEnum) {
  return (await getBotParam(id)).code;
}

async function getWorker(id: botEnum) {
  return (await getBotParam(id)).worker;
}

async function updatePeriod(id: botEnum, period: number) {
  return Param.default.findOneAndUpdate({ id }, { period });
}

async function updateCookie(id: botEnum, cookie: string) {
  return Param.default.findOneAndUpdate({ id }, { cookie });
}

async function updateCode(id: botEnum, code: string) {
  return Param.default.findOneAndUpdate({ id }, { code });
}

async function updateWorker(id: botEnum, worker: boolean) {
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