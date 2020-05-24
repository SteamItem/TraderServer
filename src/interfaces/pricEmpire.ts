export interface IPricEmpireSearchRequest {
  name?: string;
  app_id?: number;
  date_from?: Date;
  date_to?: Date;
  skin?: string;
  family?: string;
  exterior?: string;
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
  pricempire_last_price: number;
  profit: number;
  csgoempire: IPricEmpireSourceDetail;
  rollbit: IPricEmpireSourceDetail;
}