import axios, { AxiosRequestConfig } from 'axios';
import { IEmpireProfile } from '../../interfaces/profile';
import { IEmpireInstantInventoryItem, IEmpireDotaInventoryItem } from '../../interfaces/storeItem';

export class CSGOEmpireApi {
  private baseUrl = 'https://csgoempire.gg/api/v2';
  public async getToken(code: string, cookie: string) {
    let data = JSON.stringify({
      "code": code,
      "uuid": "1"
    });

    let content: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie,
        'Host': 'csgoempire.gg'
      }
    };
    var result = await axios.post(`${this.baseUrl}/user/security/token`, data, content);
    return result.data;
  }

  public async profile(cookie: string) {
    let content = {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie,
        'Host': 'csgoempire.gg'
      }
    };
    var result = await axios.get<IEmpireProfile>(`${this.baseUrl}/user`, content);
    return result.data;
  }

  public async withdraw(cookie: string, token: string, bot_id: number, item_ids: string[]) {
    let data = JSON.stringify({
      "security_token": token,
      "bot_id": bot_id,
      "item_ids": item_ids
    });

    let content = {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9,tr;q=0.8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json;charset=UTF-8',
        'Cookie': cookie,
        'Host': 'csgoempire.gg',
        'Origin': 'https://csgoempire.gg',
        'pragma': 'no-cache',
        'referer': 'https://csgoempire.gg/withdraw',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36'
      },
      withCredentials: true,
      timeout: 20000,
      maxRedirects: 4
    };
    var result = await axios.post(`${this.baseUrl}/trade/withdraw`, data, content);
    return result.data;
  }

  public async instantInventory(cookie: string) {
    var content = {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie,
        'Host': 'csgoempire.gg'
      }
    };
    var items = await axios.get<IEmpireInstantInventoryItem[]>(`${this.baseUrl}/p2p/inventory/instant`, content);
    return items.data;
  }

  public async dotaInventory(cookie: string) {
    var content = {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie,
        'Host': 'csgoempire.gg'
      }
    };
    var items = await axios.get<IEmpireDotaInventoryItem[]>(`${this.baseUrl}/inventory/site/10`, content);
    return items.data;
  }
}