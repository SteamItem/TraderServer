import pm2 = require('pm2');
import BotParam = require('../models/botParam');
import { EnumBot, getBotText } from '../helpers/enum';
import { ISteamLogin } from '../interfaces/steam';
import config = require('../config');
import helpers from '../helpers';
import telegramController = require("./telegram");
import { PuppetApi } from '../api/puppet';

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
    case EnumBot.EmpireDota: return "dotaWorker";
    case EnumBot.RollbitCsGo: return "rollbitWorker";
    case EnumBot.RollbitCsGoLogger: return "rollbitLogger";
    default: throw new Error("Bot not found");
  }
}

function getWorkerPath(fileName: string) {
  return `./dist/${fileName}.js`;
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

async function login(id: EnumBot, steamLogin: ISteamLogin) {
  const site = helpers.getSiteOfBot(id);
  const api = new PuppetApi();
  const cookies = await api.login(site, steamLogin);
  const cookie = cookies.map(c => `${c.name}=${c.value}`).join(';');
  return BotParam.default.findOneAndUpdate({ id }, { cookie });
}

async function handleBots() {
  const bots = await BotParam.default.find({worker: true}).exec();
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