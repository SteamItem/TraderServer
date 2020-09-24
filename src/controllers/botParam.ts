import pm2 = require('pm2');
import BotParam, { IBotParam } from '../models/botParam';
import { EnumBot, getBotText, EnumSite } from '../helpers/enum';
import { ISteamLogin } from '../interfaces/steam';
import config = require('../config');
import helpers from '../helpers';
import telegramController = require("./telegram");
import { PuppetApi } from '../api/puppet';
import { ICookie } from '../interfaces/puppet';

async function findOne(id: EnumBot): Promise<IBotParam> {
  const botParam = await BotParam.findOne({ id }).exec();
  return botParam;
}

async function update(id: number, worker: boolean, code: string): Promise<IBotParam> {
  await manageBot(id, worker);
  await sendBotMessage(id, worker);
  return await BotParam.findOneAndUpdate({ id }, { worker, code }).exec();
}

function manageBot(id: EnumBot, worker: boolean) {
  if (worker) {
    return startBot(id);
  } else {
    return stopBot(id);
  }
}

function sendBotMessage(bot: EnumBot, worker: boolean) {
  const botText = getBotText(bot);
  const state = worker ? "Started" : "Stopped";
  const message = `${botText}: ${state}`;
  return telegramController.sendMessage(message);
}

function getBotFileName(id: EnumBot) {
  switch (id) {
    case EnumBot.EmpireInstant: return "instantWorker";
    case EnumBot.EmpireTradeLockLogger: return "tradeLockLogger";
    case EnumBot.RollbitCsGo: return "rollbitWorker";
    case EnumBot.RollbitCsGoLogger: return "rollbitLogger";
    case EnumBot.DuelbitsCsGoWorker: return "duelbitsWorker";
    default: throw new Error("Bot not found");
  }
}

function getWorkerPath(fileName: string) {
  return `./dist/src/${fileName}.js`;
}

async function stopBot(id: number) {
  const botFileName = getBotFileName(id);
  pm2.stop(botFileName, function(err) {
    pm2.disconnect();
    if (err) throw err
  });
}

async function startBot(id: number) {
  const botFileName = getBotFileName(id);
  const workerPath = getWorkerPath(botFileName);
  pm2.connect(err => {
    if (err) {
      console.error(err);
      throw err;
    }
    pm2.start({
      script: workerPath,
      name: botFileName,
      env: {
        NODE_ENV: config.NODE_ENV,
        DB_URL: config.DB_URL,
        RDB_URL: config.RDB_URL,
        TELEGRAM_TOKEN: config.TELEGRAM_TOKEN,
        TELEGRAM_CHAT_ID: config.TELEGRAM_CHAT_ID
      }
    }, function(err) {
      pm2.disconnect();
      if (err) throw err
    });
  });
}

async function login(id: EnumBot, steamLogin: ISteamLogin): Promise<IBotParam> {
  const site = helpers.getSiteOfBot(id);
  const cookie = await getCookie(site, steamLogin);
  return BotParam.findOneAndUpdate({ id }, { cookie });
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
  const bots = await BotParam.find({worker: true}).exec();
  bots.forEach(async bot => {
    await startBot(bot.id);
  });
}

export = {
  findOne,
  update,
  login,
  handleBots
}