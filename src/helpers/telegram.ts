import TelegramBot = require('node-telegram-bot-api');
import config = require('../config');

let bot: TelegramBot;

function getBot() {
  if (bot) return bot;
  bot = new TelegramBot(config.telegramToken, {polling: true});
  return bot;
}

export = {
  getBot
}