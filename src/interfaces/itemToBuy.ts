import { EnumBot } from "../helpers/enum";

export interface IItemToBuy {
  botEnum: EnumBot;
  name: string;
  price: number;
  max_price?: number;
  wishlist_item_id: string;
}

export interface IEmpireItemToBuy extends IItemToBuy {
  bot_id: number;
  store_item_id: string;
}

export interface IRollbitItemToBuy extends IItemToBuy {
}