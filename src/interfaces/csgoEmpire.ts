import { EnumBot } from "../helpers/enum";

export interface IEmpireProfileLastSession {
  id: number;
  user_id: number;
  ip: string;
  expired: boolean;
  created_at: string;
  updated_at: string;
  city: string;
  country: string;
}

export interface IEmpireProfile {
  id: number;
  steam_id: string;
  steam_id_v3: string;
  steam_name: string;
  avatar: string;
  profile_url: string;
  registration_timestamp: string;
  registration_ip: string;
  last_login: string;
  balance: number;
  total_profit: number;
  total_bet: number;
  betback_total: number;
  bet_threshold: number;
  total_trades: number;
  total_deposit: number;
  total_withdraw: number;
  withdraw_limit: number;
  csgo_playtime: number;
  last_csgo_playtime_cache: string;
  trade_url: string;
  trade_offer_token: string;
  ref_id: number;
  total_referral_bet: number;
  total_referral_commission: number;
  ref_permission: number;
  ref_earnings: number;
  total_ref_earnings: number;
  total_ref_count: number;
  total_credit: number;
  referral_code?: any;
  referral_amount: number;
  muted_until: number;
  mute_reason?: any;
  admin: number;
  super_mod: number;
  mod: number;
  utm_campaign: string;
  country: string;
  is_vac_banned: number;
  steam_level?: any;
  last_steam_level_cache: string;
  whitelisted: number;
  total_tips_received: number;
  total_tips_sent: number;
  withdrawal_fee_owed: string;
  flags: number;
  level: number;
  xp: number;
  socket_token: string;
  user_hash: string;
  hashed_server_seed: string;
  intercom_hash: string;
  roles: any[];
  extra_security_type: string;
  total_bet_skincrash: number;
  total_bet_matchbetting: number;
  total_bet_roulette: number;
  total_bet_coinflip: number;
  total_bet_supershootout: number;
  unread_notifications: any[];
  last_session: IEmpireProfileLastSession;
  btc_deposit_address: string;
  steam_inventory_url: string;
  steam_api_key?: any;
}

export interface IEmpireItemToBuy {
  botEnum: EnumBot;
  name: string;
  price: number;
  max_price?: number;
  wishlist_item_id: string;
  bot_id: number;
  store_item_id: string;
}

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
