import { LoggerBase } from "./LoggerBase";
var telegramController = require("../../controllers/telegram");

export class TelegramLogger extends LoggerBase {
  log(message: string) {
    telegramController.sendMessage(message);
  }
}
