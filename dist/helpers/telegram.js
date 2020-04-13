"use strict";
var TelegramBot = require("node-telegram-bot-api");
var config = require("../config");
var bot;
function getBot() {
    if (bot)
        return bot;
    bot = new TelegramBot(config.TELEGRAM_TOKEN, { polling: true });
    return bot;
}
module.exports = {
    getBot: getBot
};
