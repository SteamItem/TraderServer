export interface IRollbitHistory {
  ref: string;
  price: number;
  markup: number;
  name: string;
  weapon: string;
  skin: string;
  rarity: string;
  exterior: string;
  baseprice: number;
  listed_at?: Date;
  gone_at?: Date;
}

export interface IRollbitHistoryView {
  name: string,
  price: number;
  markup: number;
  baseprice: number;
  listed_at?: Date;
  gone_at?: Date;
  fav: boolean
}
