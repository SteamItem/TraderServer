import { EnumBot, getBotText } from "../../helpers/enum";

export abstract class LoggerBase {
  protected site: string;
  protected bot: string;
  handleError(bot: EnumBot, taskName: string, message: string): void {
    var botText = getBotText(bot);
    var logMessage = `[ERROR] ${botText} Bot - ${taskName} Task: ${message}`;
    this.log(logMessage);
  }
  abstract log(message: string): void;
}
