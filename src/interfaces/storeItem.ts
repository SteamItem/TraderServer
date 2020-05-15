export interface IEmpireInventoryItem {
  name: string;
  bot_id: number;
  market_value: number;
  appid: number;
  id: string;
}

export interface IEmpireInstantInventoryItem extends IEmpireInventoryItem {
  assetid: string;
  bundle_id?: number;
  color: string;
  contextid: string;
  custom_name?: any;
  custom_price: number;
  icon_url: string;
  img: string;
  market_name: string;
  name_color: string;
  paint_index?: number;
  paint_seed?: number;
  stickers: string;
  tradable: boolean;
  tradelock: boolean;
  type: string;
  wear?: number;
}

export interface IEmpireDotaInventoryItem extends IEmpireInventoryItem {
  img: string;
  icon_url: string;
  wear?: any;
  tradelock: boolean;
  created_at: number;
}

export interface IRollbitItem {
  name: string;
  image: string;
  classid: any;
  instanceid: number;
  weapon: string;
  skin: string;
  rarity: string;
  exterior: string;
  price: number;
  markup: number;
}

export interface IRollbitInventoryItem {
  ref: string;
  price: number;
  markup: number;
  items: IRollbitItem[];
}

export interface IRollbitInventoryItems {
  items: IRollbitInventoryItem[];
}

export interface IRollbitSocketItem {
  ref: string;
  price: number;
  markup: number;
  state: string;
  items: IRollbitItem[];
}