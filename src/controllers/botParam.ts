import pm2 = require('pm2');
import { EnumBot, getBotText } from '../helpers/enum';
import { ISteamLogin } from '../interfaces/steam';
import config = require('../config');
import helpers from '../helpers';
import telegramController = require("./telegram");
import { PuppetApi } from '../api/puppet';
import { DataApi } from '../api/data';
import _ = require('lodash');

async function findOne(id: EnumBot) {
  const data = new DataApi();
  return await data.findBot(id);
}

async function update(id: number, worker: boolean, code: string) {
  await manageBot(id, worker);
  await sendBotMessage(id, worker);
  const data = new DataApi();
  return await data.updateBot(id, worker, code);
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

async function stopBot(id: number) {
  const botFileName = getBotFileName(id);
  pm2.stop(botFileName, function(err) {
    pm2.disconnect();
    if (err) throw err
  });
}

async function startBot(id: number) {
  const botFileName = getBotFileName(id);
  const workerPath = `./dist/${botFileName}.js`;
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
        DATA_API: config.DATA_API,
        TELEGRAM_TOKEN: config.TELEGRAM_TOKEN,
        TELEGRAM_CHAT_ID: config.TELEGRAM_CHAT_ID,
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
  const data = new DataApi();
  return await data.updateBotCookie(id, cookie);
}

async function handleBots() {
  const data = new DataApi();
  const bots = await data.findBots();
  const workingBots = _.filter(bots, b => b.worker);
  workingBots.forEach(async bot => {
    await startBot(bot.id);
  });
}

export = {
  findOne,
  update,
  login,
  handleBots
}