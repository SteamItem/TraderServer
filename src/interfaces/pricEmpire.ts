export interface IPricEmpireSearchRequest {
  name?: string;
  app_id?: number;
  last_days?: number;
  skin?: string;
  family?: string;
  exterior?: string;
  last_profit_from?: number;
  last_profit_to?: number;
  history_profit_from?: number;
  history_profit_to?: number;
  ignore_zero_price?: boolean;
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
  last_profit: number;
  history_profit: number;
  csgoempire: IPricEmpireSourceDetail;
  rollbit: IPricEmpireSourceDetail;
}