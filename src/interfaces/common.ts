export interface IBotParam {
  id: number;
  name: string;
  period: number;
  worker: boolean;
  cookie: string;
  code?: string;
}

export interface IWishlistItem {
  site_id: number;
  appid: number;
  name: string;
  max_price?: number;
}
