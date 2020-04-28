export interface IInstantStoreItem extends ICsGoTraderStoreItem {
  assetid: string;
  bundle_id?: number;
  color: string;
  contextid: string;
  custom_name?: any;
  market_name: string;
  name_color: string;
  paint_index?: any;
  paint_seed?: any;
  stickers?: any;
  tradable: boolean;
  type: string;
  custom_price?: number;
}

export interface IDotaStoreItem extends ICsGoTraderStoreItem {
  created_at: number;
}

export interface ICsGoTraderStoreItem {
  appid: number;
  bot_id: number;
  icon_url: string;
  id: string;
  img: string;
  market_value: number;
  name: string;
  tradelock: boolean;
  wear?: any;
}