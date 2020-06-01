import { LoggerBase } from "./LoggerBase";
const telegramController = require("../../controllers/telegram");

export class TelegramLogger extends LoggerBase {
  log(message: string) {
    telegramController.sendMessage(message);
  }
}
