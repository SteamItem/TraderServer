const TelegramBot = require('node-telegram-bot-api');
const config = require('../../config');

let bot;

function getBot(){
  if (bot) return bot;
  bot = new TelegramBot(config.telegramToken, {polling: true});
  return bot;
}

function sendMessage(message) {
  var bot = getBot();
  bot.sendMessage(config.telegramChatId, message);
}

module.exports = {
  getBot,
  sendMessage
}