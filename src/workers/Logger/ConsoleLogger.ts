import { EnumSite, EnumBot } from "../../helpers/enum";
import { LoggerBase } from "./LoggerBase";

export class ConsoleLogger extends LoggerBase {
  // TODO: Implement
  handleError(site: EnumSite, bot: EnumBot, taskName: string): void {
    throw new Error("Method not implemented.");
  }
  log(message: string) {
    console.log(message);
  }
}
