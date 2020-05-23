import { AxiosRequestConfig } from 'axios';
import { IEmpireProfile } from '../../interfaces/profile';
import { ApiBase } from './apiBase';
import { IPricEmpireItem } from '../../models/pricEmpireItem';

export class PricEmpireApi extends ApiBase {
  private baseUrl = 'https://pricempire.com/api';
  public async getItemsByName() {
    let data = JSON.stringify({
      "names": "",
      "order": "DESC",
      "limit": "",
      "appId": "all"
    });

    let content: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    var result = await this.axiosInstance.post<IPricEmpireItem[]>(`${this.baseUrl}/itemsByName`, data, content);
    return result.data;
  }

  public async getItemDetail(id: number) {
    let content = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    var result = await this.axiosInstance.get<IEmpireProfile>(`${this.baseUrl}/item/${id}`, content);
    return result.data;
  }
}