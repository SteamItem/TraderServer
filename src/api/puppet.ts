import { AxiosRequestConfig } from 'axios';
import { ApiBase } from './apiBase';
import config = require('../config');
import { EnumSite } from '../helpers/enum';
import { ISteamLogin } from '../interfaces/steam';
import { ICookie } from '../interfaces/puppet';

export class PuppetApi extends ApiBase {
  private baseUrl = config.PUPPET_API;
  public async login(site: EnumSite, steamLogin: ISteamLogin) {
    const content: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    const result = await this.axiosInstance.post<ICookie[]>(`${this.baseUrl}/login/${site}`, steamLogin, content);
    return result.data;
  }
}