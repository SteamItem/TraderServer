import { EnumBot, getBotText } from "../../helpers/enum";

export abstract class LoggerBase {
  protected site: string;
  protected bot: string;
  handleError(bot: EnumBot, taskName: string, message: string): void {
    var logMessage = `[ERROR] ${message}`;
    this.handleMessage(bot, taskName, logMessage);
  }
  handleMessage(bot: EnumBot, taskName: string, message: string): void {
    var botText = getBotText(bot);
    var logMessage = `${botText} Bot - ${taskName} Task: ${message}`;
    this.log(logMessage);
  }
  abstract log(message: string): void;
}
