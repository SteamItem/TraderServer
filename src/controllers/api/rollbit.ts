import axios, { AxiosRequestConfig } from 'axios';
import { IRollbitInventoryItems } from '../../interfaces/storeItem';

export class RollbitApi {
  private baseUrl = 'https://api.rollbit.com/steam';

  public async csgoInventory(cookie: string, minPrice: number, maxPrice: number) {
    var content: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie,
        'Host': 'api.rollbit.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36'
      }
    };

    var items = await axios.get<IRollbitInventoryItems>(`${this.baseUrl}/market?query&order=1&showTradelocked=false&showCustomPriced=false&min=${minPrice}&max=${maxPrice}`, content);
    return items.data;
  }

  public async withdraw(cookie: string, refs: string[]) {
    var content: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie,
        'Host': 'api.rollbit.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36'
      },
      withCredentials: true,
      timeout: 20000,
      maxRedirects: 4
    };

    let data = JSON.stringify({
      "refs": refs
    });
    var result = await axios.post(`${this.baseUrl}/withdraw`, data, content);
    return result.data;
  }
}