export abstract class LoggerBase {
  constructor(site: string, bot: string) {
    this.site = site;
    this.bot = bot;
  }
  protected site: string;
  protected bot: string;
  protected handleError(message: string) {
    this.log(`Error: ${message}`);
  }
  abstract log(message: string): void;
}
