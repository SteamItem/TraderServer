import { EnumBot } from "../../helpers/enum";

export abstract class LoggerBase {
  protected site: string;
  protected bot: string;
  abstract handleError(bot: EnumBot, taskName: string, message: string): void;
  abstract log(message: string): void;
}
