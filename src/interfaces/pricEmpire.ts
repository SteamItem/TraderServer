export interface IPricEmpireSearchRequest {
  name?: string;
  app_id?: number;
  date_from?: Date;
  date_to?: Date;
}

export interface IPricEmpireSourceDetail {
  min_date: Date;
  max_date: Date;
  count: number;
  min_price: number
  avg_price: number;
  max_price: number;
}

export interface IPricEmpireSearchResponse {
  id: number;
  name: string;
  app_id: number;
  pricempire_last_price: number;
  profit: number;
  csgoempire: IPricEmpireSourceDetail;
  rollbit: IPricEmpireSourceDetail;
}