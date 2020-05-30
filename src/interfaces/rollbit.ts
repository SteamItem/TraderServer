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

