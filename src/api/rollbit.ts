import axios, { AxiosRequestConfig } from 'axios';
import { IRollbitInventoryItems } from '../interfaces/rollbit';
import { ApiBase } from './apiBase';
import { Constants } from '../helpers/constant';

export class RollbitApi extends ApiBase {
  private baseUrl = 'https://api.rollbit.com/steam';

  public async csgoInventory(cookie: string, minPrice: number, maxPrice: number): Promise<IRollbitInventoryItems> {
    const content: AxiosRequestConfig = {
      headers: {
        'Cookie': cookie,
        'Host': 'api.rollbit.com',
        'User-Agent': Constants.RollbitUserAgent
      }
    };

    const url = `${this.baseUrl}/market?query&order=1&showTradelocked=false&showCustomPriced=false&min=${minPrice}&max=${maxPrice}`;
    const items = await this.axiosInstance.get<IRollbitInventoryItems>(url, content);
    return items.data;
  }

  public async withdraw(cookie: string, refs: string[]) {
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
      },
      timeout: 20000,
      maxRedirects: 4
    };

    const data = JSON.stringify({
      "refs": refs
    });
    const result = await axios.post(`${this.baseUrl}/withdraw`, data, content);
    return result.data;
  }

  public async withdrawFetch(cookie: string, refs: string[]) {
    const url = `${this.baseUrl}/withdraw`;
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
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
      },
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({ "refs": refs })
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
}