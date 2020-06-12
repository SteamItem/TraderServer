import axios, { AxiosRequestConfig } from 'axios';
import fetch from "node-fetch";
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
    const url = `${this.baseUrl}/withdraw`;
    const headers: HeadersInit = {
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
    };
    const body: BodyInit = JSON.stringify({
      "refs": refs
    });

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
      timeout: 20000,
      follow: 4
    });
    return response.json();
  }
}