import { EnumBot, getBotText } from "../../helpers/enum";
import { LoggerBase } from "./LoggerBase";

export class ConsoleLogger extends LoggerBase {
  handleError(bot: EnumBot, taskName: string, message: string): void {
    var botText = getBotText(bot);
    var logMessage = `[ERROR] ${botText} Bot - ${taskName} Task: ${message}`;
    this.log(logMessage);
  }
  log(message: string) {
    console.log(message);
  }
}
