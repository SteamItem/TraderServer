import { ApiBase } from './apiBase';
import config = require('../config');
import { EnumBot } from '../helpers/enum';

export class BotApi extends ApiBase {
  private baseUrl = config.BOT_API;
  public async start(bot: EnumBot) {
    const result = await this.axiosInstance.get(`${this.baseUrl}/start/${bot}`);
    return result.data;
  }

  public async stop(bot: EnumBot) {
    const result = await this.axiosInstance.get(`${this.baseUrl}/stop/${bot}`);
    return result.data;
  }
}