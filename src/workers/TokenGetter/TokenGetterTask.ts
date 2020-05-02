import { IBotParam } from '../../models/botParam';
import { WorkerTask } from '../Common/WorkerTask';
export abstract class TokenGetterTask extends WorkerTask {
  workerJobName = "Token Getter";
  constructor(botParam: IBotParam) {
    super();
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
    this.$token = await this.getToken();
  }
  abstract getToken(): Promise<string>;
}
