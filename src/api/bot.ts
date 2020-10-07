import { AxiosRequestConfig } from 'axios';
import { ApiBase } from './apiBase';
import config = require('../config');

export class BotApi extends ApiBase {
  private baseUrl = config.BOT_API;

  public async start(botId: string): Promise<any> {
    const content: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    const result = await this.axiosInstance.get(`${this.baseUrl}/start/${botId}`, content);
    return result.data;
  }

  public async stop(botId: string): Promise<any> {
    const content: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    const result = await this.axiosInstance.get(`${this.baseUrl}/stop/${botId}`, content);
    return result.data;
  }

}