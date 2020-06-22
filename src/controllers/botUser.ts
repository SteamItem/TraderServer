import pm2 = require('pm2');
import BotUser, { IBotUser } from '../models/botUser';
import { EnumBot, getBotText } from '../helpers/enum';
import { ISteamLogin } from '../interfaces/steam';
import config = require('../config');
import helpers from '../helpers';
import telegramController = require("./telegram");
import { PuppetApi } from '../api/puppet';

async function findBots(botid: EnumBot): Promise<IBotUser[]> {
  const botUsers = await BotUser.find({ botid }).exec();
  return botUsers;
}

async function findOne(id: string): Promise<IBotUser> {
  const botUser = await BotUser.findById(id).exec();
  return botUser;
}

async function update(id: string, worker: boolean, code: string, wishlist_id: string): Promise<IBotUser> {
  const botUser = await findOne(id);
  await manageBot(id, worker);
  await sendBotMessage(botUser.botid, worker);
  return await BotUser.findByIdAndUpdate(id, { worker, code, wishlist_id }).exec();
}

function manageBot(id: string, worker: boolean) {
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

function getWorkerPath() {
  return `./dist/src/bot.js`;
}

async function stopBot(botUserId: string) {
  pm2.stop(botUserId, function(err) {
    pm2.disconnect();
    if (err) throw err
  });
}

async function startBot(id: string) {
  const workerPath = getWorkerPath();
  pm2.connect(err => {
    if (err) {
      console.error(err);
      throw err;
    }
    pm2.start({
      script: workerPath,
      name: id,
      env: {
        NODE_ENV: config.NODE_ENV,
        DB_URL: config.DB_URL,
        RDB_URL: config.RDB_URL,
        BOTUSER_ID: id,
        TELEGRAM_TOKEN: config.TELEGRAM_TOKEN,
        TELEGRAM_CHAT_ID: config.TELEGRAM_CHAT_ID
      }
    }, function(err) {
      pm2.disconnect();
      if (err) throw err
    });
  });
}

async function login(id: string, steamLogin: ISteamLogin): Promise<IBotUser> {
  const botUser = await findOne(id);
  const site = helpers.getSiteOfBot(botUser.botid);
  const api = new PuppetApi();
  const cookies = await api.login(site, steamLogin);
  const cookie = cookies.map(c => `${c.name}=${c.value}`).join(';');
  return BotUser.findByIdAndUpdate(id, { cookie, steam_username: steamLogin.username });
}

async function handleBots() {
  const bots = await BotUser.find({worker: true}).exec();
  bots.forEach(async bot => {
    await startBot(bot.id);
  });
}

export = {
  findBots,
  findOne,
  update,
  login,
  handleBots
}