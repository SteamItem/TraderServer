import { AxiosRequestConfig } from 'axios';
import { ApiBase } from './apiBase';
import config = require('../config');
import { EnumSite, EnumSteamApp, EnumBot } from '../helpers/enum';
import { IWishlistItem, IBotParam } from '../interfaces/common';
import { IPricEmpireItem, IPricEmpireItemPrice, IPricEmpireSearchRequest, IPricEmpireSearchResponse } from '../interfaces/pricEmpire';
import { IRollbitHistory } from '../interfaces/rollbit';

export class DataApi extends ApiBase {
  private baseUrl = config.DATA_API;
  private wishlistItemBaseUrl = `${this.baseUrl}/wishlistItems`;
  private botBaseUrl = `${this.baseUrl}/bot`;
  private profitBaseUrl = `${this.baseUrl}/profit`;
  private pricEmpireBaseUrl = `${this.baseUrl}/pricEmpire`;
  private rollbitBaseUrl = `${this.baseUrl}/rollbit`;
  private config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
    }
  };

  public async createWishlistItem(item: IWishlistItem): Promise<IWishlistItem> {
    const result = await this.axiosInstance.post<IWishlistItem>(`${this.wishlistItemBaseUrl}`, item, this.config);
    return result.data;
  }

  public async findAllWishlistItems(): Promise<IWishlistItem[]> {
    const result = await this.axiosInstance.get<IWishlistItem[]>(`${this.wishlistItemBaseUrl}`, this.config);
    return result.data;
  }

  public async findWishlistItem(id: string): Promise<IWishlistItem> {
    const result = await this.axiosInstance.get<IWishlistItem>(`${this.wishlistItemBaseUrl}/${id}`, this.config);
    return result.data;
  }

  public async updateWishlistItem(id: string, item: IWishlistItem): Promise<IWishlistItem> {
    const result = await this.axiosInstance.put<IWishlistItem>(`${this.wishlistItemBaseUrl}/${id}`, item, this.config);
    return result.data;
  }

  public async deleteWishlistItem(id: string): Promise<string> {
    const result = await this.axiosInstance.delete<string>(`${this.wishlistItemBaseUrl}/${id}`, this.config);
    return result.data;
  }

  public async searchWishlistItems(site: EnumSite, app: EnumSteamApp): Promise<IWishlistItem[]> {
    const body = { site, app };
    const result = await this.axiosInstance.post<IWishlistItem[]>(`${this.wishlistItemBaseUrl}/search`, body, this.config);
    return result.data;
  }

  public async findBot(id: EnumBot): Promise<IBotParam> {
    const result = await this.axiosInstance.get<IBotParam>(`${this.botBaseUrl}/${id}`, this.config);
    return result.data;
  }

  public async findBots(): Promise<IBotParam[]> {
    const result = await this.axiosInstance.get<IBotParam[]>(`${this.botBaseUrl}`, this.config);
    return result.data;
  }

  public async updateBot(id: EnumBot, worker: boolean, code: string): Promise<IBotParam> {
    const data = { worker, code };
    const result = await this.axiosInstance.put<IBotParam>(`${this.botBaseUrl}/${id}`, data, this.config);
    return result.data;
  }

  public async updateBotCookie(id: EnumBot, cookie: string): Promise<IBotParam> {
    const data = { cookie };
    const result = await this.axiosInstance.put<IBotParam>(`${this.botBaseUrl}/cookie/${id}`, data, this.config);
    return result.data;
  }

  public async updatePricEmpireItems(items: IPricEmpireItem[]): Promise<string> {
    const result = await this.axiosInstance.post<string>(`${this.pricEmpireBaseUrl}/updateItems`, items, this.config);
    return result.data;
  }

  public async updatePricEmpireItemPrices(prices: IPricEmpireItemPrice[]): Promise<string> {
    const result = await this.axiosInstance.post<string>(`${this.pricEmpireBaseUrl}/updateItemPrices`, prices, this.config);
    return result.data;
  }

  public async findRollbitHistories(): Promise<IRollbitHistory[]> {
    const result = await this.axiosInstance.get<IRollbitHistory[]>(`${this.rollbitBaseUrl}`, this.config);
    return result.data;
  }

  public async findRollbitFavs(): Promise<string[]> {
    const result = await this.axiosInstance.get<string[]>(`${this.rollbitBaseUrl}/favs`, this.config);
    return result.data;
  }

  public async addRollbitFav(name: string): Promise<any> {
    const data = { name };
    const result = await this.axiosInstance.post<string>(`${this.rollbitBaseUrl}/addFav`, data, this.config);
    return result.data;
  }

  public async deleteRollbitFav(name: string): Promise<any> {
    const data = { name };
    const result = await this.axiosInstance.post<string>(`${this.rollbitBaseUrl}/removeFav`, data, this.config);
    return result.data;
  }

  public async updateRollbitHistoryListed(item: IRollbitHistory) {
    const result = await this.axiosInstance.post<string>(`${this.rollbitBaseUrl}/updateListed`, item, this.config);
    return result.data;
  }

  public async updateRollbitHistoryGone(item: IRollbitHistory) {
    const result = await this.axiosInstance.post<string>(`${this.rollbitBaseUrl}/updateGone`, item, this.config);
    return result.data;
  }

  public async profitSearch(pricEmpireSearchRequest: IPricEmpireSearchRequest): Promise<IPricEmpireSearchResponse[]> {
    const result = await this.axiosInstance.post<IPricEmpireSearchResponse[]>(`${this.profitBaseUrl}`, pricEmpireSearchRequest, this.config);
    return result.data;
  }
}