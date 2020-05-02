import { EnumSite, EnumBot } from "../../helpers/enum";

export abstract class LoggerBase {
  protected site: string;
  protected bot: string;
  abstract handleError(site: EnumSite, bot: EnumBot, taskName: string): void;
  abstract log(message: string): void;
}
