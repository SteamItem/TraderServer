import { LoggerBase } from "./LoggerBase";
import telegramController = require("../../controllers/telegram");

export class TelegramLogger extends LoggerBase {
  log(message: string) {
    telegramController.sendMessage(message);
  }
}
