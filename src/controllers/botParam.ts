import pm2 = require('pm2');
import BotParam = require('../models/botParam');
import { EnumBot } from '../helpers/enum';
import { ISteamLogin } from '../interfaces/steam';
import rollbitPuppet from './puppet/rollbit'
import { Cookie } from 'puppeteer';

async function findOne(id: EnumBot) {
  var botParam = await BotParam.default.findOne({ id }).exec();
  if (!botParam) throw new Error("BotParam not found");
  return botParam;
}

async function update(id: number, worker: boolean, code: string, cookie: string) {
  if(!cookie) {
    throw new Error("cookie can not be empty");
  }
  return BotParam.default.findOneAndUpdate({ id }, { worker, code, cookie });
}

function manageBot(id: EnumBot, worker: boolean) {
  if (worker) {
    startBot(id);
  } else {
    stopBot(id);
  }
}

function getBotFileName(id: EnumBot) {
  switch (id) {
    case EnumBot.EmpireInstant: return "instantWorker";
    case EnumBot.EmpireDota: return "dotaWorker";
    case EnumBot.RollbitCsGo: return "rollbitWorker";
    default: throw new Error("Bot not found");
  }
}

function getWorkerPath(fileName: string) {
  return `./dist/${fileName}.js`;
}

async function stopBot(id: number) {
  var botFileName = this.getBotFileName(id);
  pm2.stop(botFileName, function(err) {
    pm2.disconnect();
    if (err) throw err
  });
}

async function startBot(id: number) {
  var botFileName = getBotFileName(id);
  var workerPath = getWorkerPath(botFileName);
  pm2.connect(err => {
    if (err) {
      console.error(err);
      process.exit(2);
    }
    pm2.start({
      script: workerPath,
      name: botFileName,
      env: {
        DB_URL: process.env.DB_URL
      }
    }, function(err) {
      pm2.disconnect();
      if (err) throw err
    });
  });
}

async function updateCookie(id: EnumBot, steamLogin: ISteamLogin) {
  var cookies: Cookie[];
  switch (id) {
    case EnumBot.EmpireInstant:
    case EnumBot.EmpireDota:
      throw new Error("Empire cookie update is not implemented");
    case EnumBot.RollbitCsGo:
      cookies = await rollbitPuppet.login(steamLogin);
      break;
    default: throw new Error("Unknown bot id");
  }
  var cookie = cookies.map(c => `${c.name}=${c.value}`).join(';');
  return BotParam.default.findOneAndUpdate({ id }, { cookie });
}

export = {
  findOne,
  update,
  updateCookie
}