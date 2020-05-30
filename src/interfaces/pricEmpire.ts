export interface IPricEmpireSearchRequest {
  name?: string;
  app_id?: number;
  last_days?: number;
  skin?: string;
  family?: string;
  exterior?: string;
  last_price_from?: number;
  last_price_to?: number;
  ignore_zero_price?: boolean;
  last_profit_from?: number;
  last_profit_to?: number;
  history_profit_from?: number;
  history_profit_to?: number;
}

export interface IPricEmpireSourceDetail {
  min_date: Date;
  max_date: Date;
  count: number;
  min_price: number
  avg_price: number;
  max_price: number;
  update_date: Date;
}

export interface IPricEmpireSearchResponse {
  id: number;
  name: string;
  app_id: number;
  last_price: number;
  last_profit?: number;
  history_profit?: number;
  csgoempire?: IPricEmpireSourceDetail;
  rollbit?: IPricEmpireSourceDetail;
}

export interface IPricEmpireItem {
  id: number;
  market_hash_name: string;
  image: string;
  app_id: number;
  last_price: number;
  buff_id: number;
  skin: string;
  family: string;
  exterior: string;
  created_at: Date;
}


export interface PricEmpireItemFamily {
  id: number;
  market_hash_name: string;
  image: string;
  app_id: number;
  last_price: number;
  buff_id: number;
  skin: string;
  family: string;
  exterior: string;
  created_at: Date;
}

export interface IPricEmpireItemPrice {
  id: number;
  item_id: number;
  price: number;
  source: string;
  created_at: Date;
}

export interface IPricEmpireItemQuantity {
  id: number;
  itemId: number;
  qty: number;
  source: string;
  date: string;
  created_at: Date;
}

export interface IPricEmpireItemDetail {
  id: number;
  market_hash_name: string;
  image: string;
  app_id: number;
  last_price: number;
  buff_id: number;
  skin: string;
  family: PricEmpireItemFamily[];
  exterior: string;
  created_at: Date;
  api_selection_date: Date;
  prices: IPricEmpireItemPrice[];
  qty: IPricEmpireItemQuantity[];
}
