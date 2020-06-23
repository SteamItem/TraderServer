import { AxiosRequestConfig } from 'axios';
import { IRollbitInventoryItems } from '../interfaces/rollbit';
import { ApiBase } from './apiBase';
import { Constants } from '../helpers/constant';

export class RollbitApi extends ApiBase {
  private baseUrl = 'https://api.rollbit.com/steam';

  public async csgoInventory(cookie: string): Promise<IRollbitInventoryItems> {
    const content: AxiosRequestConfig = {
      headers: {
        'Host': 'api.rollbit.com',
        'Connection': 'keep-alive',
        'Accept': 'application/json, text/*',
        'User-Agent': Constants.RollbitUserAgent,
        'Origin': 'https://www.rollbit.com',
        'Sec-Fetch-Site': 'same-site',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Referer': 'https://www.rollbit.com/',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cookie': cookie,
      }
    };

    const url = `${this.baseUrl}/market?query&order=1&showTradelocked=false&showCustomPriced=true&min=0&max=4294967295`
    const items = await this.axiosInstance.get<IRollbitInventoryItems>(url, content);
    return items.data;
  }

  public async withdraw(cookie: string, refs: string[]): Promise<Response> {
    const content: AxiosRequestConfig = {
      headers: {
        'Accept': 'application/json, text/*',
        'Accept-Language': 'en-US,en;q=0.9,tr;q=0.8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json; charset=UTF-8',
        'Cookie': cookie,
        'Host': 'api.rollbit.com',
        'Origin': 'https://www.rollbit.com',
        'Pragma': 'no-cache',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': Constants.RollbitUserAgent
      }
    };

    const body: BodyInit = JSON.stringify({
      "refs": refs
    });

    const url = `${this.baseUrl}/withdraw`;
    console.log('httpagent status: %j', this.httpAgent.getCurrentStatus());
    console.log('httpsagent status: %j', this.httpsAgent.getCurrentStatus());
    console.log('--------------------');
    const items = await this.axiosInstance.post(url, body, content);
    return items.data;
  }
}