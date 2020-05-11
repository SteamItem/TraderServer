import { EnumBot, getBotText } from "../../helpers/enum";

export abstract class LoggerBase {
  protected site: string;
  protected bot: string;
  handleError(bot: EnumBot, taskName: string, message: string): void {
    var botText = getBotText(bot);
    var logMessage = `[ERROR] ${botText}/${taskName}: ${message}`;
    this.log(logMessage);
  }
  handleMessage(bot: EnumBot, taskName: string, message: string): void {
    var botText = getBotText(bot);
    var logMessage = `${botText}/${taskName}: ${message}`;
    this.log(logMessage);
  }
  abstract log(message: string): void;
}
