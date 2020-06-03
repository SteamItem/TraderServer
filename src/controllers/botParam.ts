import BotParam = require('../models/botParam');
import { EnumBot, getBotText } from '../helpers/enum';
import { ISteamLogin } from '../interfaces/steam';
import helpers from '../helpers';
import telegramController = require("./telegram");
import { PuppetApi } from '../api/puppet';
import { BotApi } from '../api/bot';

async function findOne(id: EnumBot) {
  const botParam = await BotParam.default.findOne({ id }).exec();
  if (!botParam) throw new Error("BotParam not found");
  return botParam;
}

async function update(id: number, worker: boolean, code: string) {
  await manageBot(id, worker);
  await sendBotMessage(id, worker);
  return await BotParam.default.findOneAndUpdate({ id }, { worker, code }).exec();
}

function manageBot(id: EnumBot, worker: boolean) {
  const api = new BotApi();
  if (worker) {
    return api.start(id);
  } else {
    return api.stop(id);
  }
}

function sendBotMessage(bot: EnumBot, worker: boolean) {
  const botText = getBotText(bot);
  const state = worker ? "Started" : "Stopped";
  const message = `${botText}: ${state}`;
  return telegramController.sendMessage(message);
}

async function login(id: EnumBot, steamLogin: ISteamLogin) {
  const site = helpers.getSiteOfBot(id);
  const api = new PuppetApi();
  const cookies = await api.login(site, steamLogin);
  const cookie = cookies.map(c => `${c.name}=${c.value}`).join(';');
  return BotParam.default.findOneAndUpdate({ id }, { cookie });
}

export = {
  findOne,
  update,
  login
}