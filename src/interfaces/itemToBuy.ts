export interface IItemToBuy {
  bot_id: number;
  name: string;
  market_value: number;
  max_price?: number;
  store_item_id: string;
  wishlist_item_id: string;
}