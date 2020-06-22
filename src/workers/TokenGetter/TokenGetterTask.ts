import { IBotUser } from '../../models/botUser';
import { WorkerTask } from '../Common/WorkerTask';
export abstract class TokenGetterTask extends WorkerTask {
  taskName = "Token Getter";
  constructor(botUser: IBotUser) {
    super();
    this.$botUser = botUser;
  }
  private $botUser: IBotUser;
  public get botUser(): IBotUser {
    return this.$botUser;
  }
  private $token: string;
  public get token(): string {
    return this.$token;
  }
  async work(): Promise<void> {
    this.$token = await this.getToken();
  }
  abstract getToken(): Promise<string>;
}
