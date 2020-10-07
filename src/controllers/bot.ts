import Bot, { IBot } from '../models/bot';
import { EnumBot, getBotText, EnumSite } from '../helpers/enum';
import { ISteamLogin } from '../interfaces/steam';
import helpers from '../helpers';
import telegramController = require("./telegram");
import { PuppetApi } from '../api/puppet';
import { BotApi } from '../api/bot';
import { ICookie } from '../interfaces/puppet';

async function findById(id: string): Promise<IBot> {
  const botParam = await Bot.findById(id).exec();
  return botParam;
}

async function update(botId: string, worker: boolean, code: string): Promise<IBot> {
  const bot = await findById(botId);
  await manageBot(botId, worker);
  await sendBotMessage(bot.type, worker);
  return await Bot.findByIdAndUpdate(botId, { worker, code }).exec();
}

function manageBot(botId: string, worker: boolean) {
  if (worker) {
    return startBot(botId);
  } else {
    return stopBot(botId);
  }
}

function sendBotMessage(bot: EnumBot, worker: boolean) {
  const botText = getBotText(bot);
  const state = worker ? "Started" : "Stopped";
  const message = `${botText}: ${state}`;
  return telegramController.sendMessage(message);
}

async function stopBot(botId: string) {
  const api = new BotApi();
  await api.stop(botId);
}

async function startBot(botId: string) {
  const api = new BotApi();
  await api.start(botId);
}

async function login(id: EnumBot, steamLogin: ISteamLogin): Promise<IBot> {
  const site = helpers.getSiteOfBot(id);
  const cookie = await getCookie(site, steamLogin);
  return Bot.findOneAndUpdate({ id }, { cookie });
}

async function getCookie(site: EnumSite, steamLogin: ISteamLogin) {
  switch (site){
    case EnumSite.CsGoEmpire: return empireLoginCookie(steamLogin);
    case EnumSite.Rollbit: return rollbitLoginCookie(steamLogin);
    case EnumSite.Duelbits: return duelbitsLoginCookie(steamLogin);
  }
}

async function empireLoginCookie(steamLogin: ISteamLogin): Promise<string> {
  const api = new PuppetApi();
  const cookies = await api.empireLogin(steamLogin);
  const cookie = stringifyCookies(cookies);
  return cookie;
}

async function rollbitLoginCookie(steamLogin: ISteamLogin): Promise<string> {
  const api = new PuppetApi();
  const cookies = await api.rollbitLogin(steamLogin);
  const cookie = stringifyCookies(cookies);
  return cookie;
}

function stringifyCookies(cookies: ICookie[]): string {
  return cookies.map(c => `${c.name}=${c.value}`).join(';');
}

async function duelbitsLoginCookie(steamLogin: ISteamLogin): Promise<string> {
  const api = new PuppetApi();
  const response = await api.duelbitsLogin(steamLogin);
  return response.token;
}

async function handleBots() {
  const bots = await Bot.find({worker: true}).exec();
  bots.forEach(async bot => {
    await startBot(bot.id);
  });
}

export = {
  findById,
  update,
  login,
  handleBots
}