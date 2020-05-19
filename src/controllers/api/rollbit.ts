import { AxiosRequestConfig } from 'axios';
import { IRollbitInventoryItems } from '../../interfaces/storeItem';
import { ApiBase } from './apiBase';
import { Constants } from '../../helpers/constant';

export class RollbitApi extends ApiBase {
  private baseUrl = 'https://api.rollbit.com/steam';

  public async csgoInventory(cookie: string, minPrice: number, maxPrice: number) {
    var content: AxiosRequestConfig = {
      headers: {
        'Cookie': cookie,
        'Host': 'api.rollbit.com',
        'User-Agent': Constants.RollbitUserAgent
      }
    };

    var url = `${this.baseUrl}/market?query&order=1&showTradelocked=false&showCustomPriced=false&min=${minPrice}&max=${maxPrice}`;
    var items = await this.axiosInstance.get<IRollbitInventoryItems>(url, content);
    return items.data;
  }

  public async withdraw(cookie: string, refs: string[]) {
    var content: AxiosRequestConfig = {
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

    let data = JSON.stringify({
      "refs": refs
    });
    var result = await this.axiosInstance.post(`${this.baseUrl}/withdraw`, data, content);
    return result.data;
  }
}