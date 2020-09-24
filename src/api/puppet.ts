import { AxiosRequestConfig } from 'axios';
import { ApiBase } from './apiBase';
import config = require('../config');
import { ISteamLogin } from '../interfaces/steam';
import { ICookie, IDuelbitsResponse } from '../interfaces/puppet';

export class PuppetApi extends ApiBase {
  private baseUrl = config.PUPPET_API;

  public async empireLogin(steamLogin: ISteamLogin): Promise<ICookie[]> {
    const content: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    const result = await this.axiosInstance.post<ICookie[]>(`${this.baseUrl}/login/empire`, steamLogin, content);
    return result.data;
  }

  public async rollbitLogin(steamLogin: ISteamLogin): Promise<ICookie[]> {
    const content: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    const result = await this.axiosInstance.post<ICookie[]>(`${this.baseUrl}/login/rollbit`, steamLogin, content);
    return result.data;
  }

  public async duelbitsLogin(steamLogin: ISteamLogin): Promise<IDuelbitsResponse> {
    const content: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    const result = await this.axiosInstance.post<IDuelbitsResponse>(`${this.baseUrl}/login/duelbits`, steamLogin, content);
    return result.data;
  }
}