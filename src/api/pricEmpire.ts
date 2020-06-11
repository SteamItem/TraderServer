import { AxiosRequestConfig } from 'axios';
import { ApiBase } from './apiBase';
import { IPricEmpireItem, IPricEmpireItemDetail } from '../interfaces/pricEmpire';

export class PricEmpireApi extends ApiBase {
  private baseUrl = 'https://pricempire.com/api';
  public async getItemsByName(): Promise<IPricEmpireItem[]> {
    const data = JSON.stringify({
      "names": "",
      "order": "DESC",
      "limit": "",
      "appId": "all"
    });

    const content: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    const result = await this.axiosInstance.post<IPricEmpireItem[]>(`${this.baseUrl}/itemsByName`, data, content);
    return result.data;
  }

  public async getItemDetail(id: number): Promise<IPricEmpireItemDetail> {
    const content = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    const result = await this.axiosInstance.get<IPricEmpireItemDetail>(`${this.baseUrl}/item/${id}`, content);
    return result.data;
  }
}