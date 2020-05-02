import { IBotParam } from '../../models/botParam';
import { LoggerBase } from '../Logger/LoggerBase';
import { WorkerTask } from '../Common/WorkerTask';
export abstract class TokenGetterTask extends WorkerTask {
  constructor(botParam: IBotParam, logger: LoggerBase) {
    super(logger);
    this.$botParam = botParam;
  }
  private $botParam: IBotParam;
  public get botParam(): IBotParam {
    return this.$botParam;
  }
  private $token: string;
  public get token(): string {
    return this.$token;
  }
  async work() {
    return await this.getToken();
  }
  abstract getToken(): Promise<string>;
}
