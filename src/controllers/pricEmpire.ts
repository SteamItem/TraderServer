import _ = require("lodash");
import { PricEmpireApi } from "./api/pricEmpire"
import PricEmpireItem = require('../models/pricEmpireItem');
import PricEmpireItemDetail = require('../models/pricEmpireItemDetail');
import RollbitHistory, { IRollbitHistoryDocument } from "../models/rollbitHistory";
import { IPricEmpireSearchRequest, IPricEmpireSearchResponse, IPricEmpireSourceDetail } from "../interfaces/pricEmpire";
import { PricEmpireItemPrice } from "../models/pricEmpireItemDetail";

async function searchPricEmpireItems(pricEmpireSearchRequest: IPricEmpireSearchRequest): Promise<PricEmpireItem.IPricEmpireItem[]> {
  let itemsQuery = PricEmpireItem.default.find();

  if (pricEmpireSearchRequest.name) {
    let escape = _.escapeRegExp(pricEmpireSearchRequest.name);
    let regexVal = new RegExp(`.*${escape}.*`);
    itemsQuery = itemsQuery.where('market_hash_name').regex(regexVal);
  }

  if (pricEmpireSearchRequest.app_id) {
    itemsQuery = itemsQuery.where('app_id').equals(pricEmpireSearchRequest.app_id);
  }

  if (pricEmpireSearchRequest.exterior) {
    itemsQuery = itemsQuery.where('exterior').equals(pricEmpireSearchRequest.exterior);
  }

  if (pricEmpireSearchRequest.family) {
    itemsQuery = itemsQuery.where('family').equals(pricEmpireSearchRequest.family);
  }

  if (pricEmpireSearchRequest.skin) {
    itemsQuery = itemsQuery.where('skin').equals(pricEmpireSearchRequest.skin);
  }

  let itemsResult = await itemsQuery.exec();
  return itemsResult;
}

async function searchPricEmpireItemDetails(pricEmpireSearchRequest: IPricEmpireSearchRequest): Promise<PricEmpireItemDetail.IPricEmpireItemDetail[]> {
  let itemDetailsQuery = PricEmpireItemDetail.default.find();

  if (pricEmpireSearchRequest.name) {
    let escape = _.escapeRegExp(pricEmpireSearchRequest.name);
    let regexVal = new RegExp(`.*${escape}.*`);
    itemDetailsQuery = itemDetailsQuery.where('market_hash_name').regex(regexVal);
  }

  if (pricEmpireSearchRequest.app_id) {
    itemDetailsQuery = itemDetailsQuery.where('app_id').equals(pricEmpireSearchRequest.app_id);
  }

  let itemDetailsResult = await itemDetailsQuery.exec();
  return itemDetailsResult;
}

async function searchRollbitHistories(pricEmpireSearchRequest: IPricEmpireSearchRequest): Promise<IRollbitHistoryDocument[]> {
  let rollbitHistoryQuery = RollbitHistory.find();

  if (pricEmpireSearchRequest.name) {
    let escape = _.escapeRegExp(pricEmpireSearchRequest.name);
    let regexVal = new RegExp(`.*${escape}.*`);
    rollbitHistoryQuery = rollbitHistoryQuery.where('name').regex(regexVal);
  }

  if (pricEmpireSearchRequest.app_id) {
    rollbitHistoryQuery = rollbitHistoryQuery.where('app_id').equals(pricEmpireSearchRequest.app_id);
  }

  let rollbitHistoryAllResult = await rollbitHistoryQuery.exec();
  return rollbitHistoryAllResult;
}

function getRollbitDetail(rollbitHistoryResult: IRollbitHistoryDocument[]): IPricEmpireSourceDetail {
  let rollbitDetail: IPricEmpireSourceDetail;
  if (rollbitHistoryResult.length == 0) return rollbitDetail;
  let rollbit_listed_exist = _.filter(rollbitHistoryResult, rhr => rhr.listed_at != null);
  let rollbit_gone_exist = _.filter(rollbitHistoryResult, rhr => rhr.gone_at != null);

  let rollbit_min_listed_sort = _.minBy(rollbit_listed_exist, rhr => rhr.listed_at);
  let rollbit_min_gone_sort = _.minBy(rollbit_gone_exist, rhr => rhr.gone_at);
  let rollbit_min_arr: Date[] = [];
  if (rollbit_min_listed_sort) rollbit_min_arr.push(rollbit_min_listed_sort.listed_at);
  if (rollbit_min_gone_sort) rollbit_min_arr.push(rollbit_min_gone_sort.gone_at);
  let rollbit_min_date = _.min(rollbit_min_arr);

  let rollbit_max_listed_sort = _.maxBy(rollbit_listed_exist, rhr => rhr.listed_at);
  let rollbit_max_gone_sort = _.maxBy(rollbit_gone_exist, rhr => rhr.gone_at);
  let rollbit_max_arr: Date[] = [];
  if (rollbit_max_listed_sort) rollbit_max_arr.push(rollbit_max_listed_sort.listed_at);
  if (rollbit_max_gone_sort) rollbit_max_arr.push(rollbit_max_gone_sort.gone_at);
  let rollbit_max_date = _.max(rollbit_max_arr);

  let rollbit_count = rollbitHistoryResult.length;

  let rollbit_min_base_sort = _.minBy(rollbitHistoryResult, rhr => rhr.baseprice);
  let rollbit_min_base_price: number;
  if (rollbit_min_base_sort) rollbit_min_base_price = rollbit_min_base_sort.baseprice;
  let rollbit_avg_base_price = _.meanBy(rollbitHistoryResult, rhr => rhr.baseprice);
  let rollbit_max_base_sort = _.maxBy(rollbitHistoryResult, rhr => rhr.baseprice);
  let rollbit_max_base_price: number;
  if (rollbit_max_base_sort) rollbit_max_base_price = rollbit_max_base_sort.baseprice;

  rollbitDetail = {
    min_date: rollbit_min_date,
    max_date: rollbit_max_date,
    count: rollbit_count,
    min_price: rollbit_min_base_price,
    avg_price: rollbit_avg_base_price,
    max_price: rollbit_max_base_price,
    update_date: rollbit_max_date
  }
  return rollbitDetail;
}

function getCsgoEmpireDetail(empireDetail: PricEmpireItemDetail.IPricEmpireItemDetail, detailEmpirePrices: PricEmpireItemPrice[]): IPricEmpireSourceDetail {
  let csgoempireDetail: IPricEmpireSourceDetail;
  if (detailEmpirePrices.length == 0) return csgoempireDetail;
  let csgoempire_min_date = _.minBy(detailEmpirePrices, dep => dep.created_at).created_at;
  let csgoempire_max_date = _.maxBy(detailEmpirePrices, dep => dep.created_at).created_at;
  let csgoempire_count = detailEmpirePrices.length;
  let csgoempire_min_price = _.minBy(detailEmpirePrices, dep => dep.price).price * 1.12 / 100;
  let csgoempire_avg_price = _.meanBy(detailEmpirePrices, dep => dep.price) * 1.12 / 100;
  let csgoempire_max_price = _.maxBy(detailEmpirePrices, dep => dep.price).price * 1.12 / 100;

  csgoempireDetail = {
    min_date: csgoempire_min_date,
    max_date: csgoempire_max_date,
    count: csgoempire_count,
    min_price: csgoempire_min_price,
    avg_price: csgoempire_avg_price,
    max_price: csgoempire_max_price,
    update_date: empireDetail.api_selection_date
  }
  return csgoempireDetail;
}

async function searchItems(pricEmpireSearchRequest: IPricEmpireSearchRequest): Promise<IPricEmpireSearchResponse[]> {
  let itemsResult = await searchPricEmpireItems(pricEmpireSearchRequest);
  let itemDetailsResult = await searchPricEmpireItemDetails(pricEmpireSearchRequest);
  let rollbitHistoryAllResult = await searchRollbitHistories(pricEmpireSearchRequest);

  let mappedResult: IPricEmpireSearchResponse[] = _.map(itemsResult, r => {
    let empireDetail = _.find(itemDetailsResult, d => d.id === r.id);
    let detailEmpirePrices: PricEmpireItemPrice[] = [];
    if (empireDetail) {
      detailEmpirePrices = _.filter(empireDetail.prices, p => p.source === "csgoempire");
    }
    let rollbitHistoryResult = _.filter(rollbitHistoryAllResult, rh => rh.name === r.market_hash_name);

    if (pricEmpireSearchRequest.last_days) {
      let date_from = new Date();
      date_from.setDate(date_from.getDate() - pricEmpireSearchRequest.last_days);
      detailEmpirePrices = _.filter(detailEmpirePrices, dep => dep.created_at >= date_from);
      rollbitHistoryResult = _.filter(rollbitHistoryResult, rhr => rhr.listed_at >= date_from || rhr.gone_at >= date_from);
    }

    let rollbitDetail = getRollbitDetail(rollbitHistoryResult);
    let csgoempireDetail = getCsgoEmpireDetail(empireDetail, detailEmpirePrices);

    let last_profit: number;
    if (csgoempireDetail != null && rollbitDetail != null) {
      last_profit = 100 * (csgoempireDetail.avg_price - rollbitDetail.avg_price) / rollbitDetail.avg_price;
    }

    let converted_pricempire_last_price = r.last_price * 1.12 / 100;
    let history_profit: number;
    if (converted_pricempire_last_price > 0 && rollbitDetail != null) {
      history_profit = 100 * (converted_pricempire_last_price - rollbitDetail.avg_price) / converted_pricempire_last_price;
    }

    let response: IPricEmpireSearchResponse = {
      id: r.id,
      name: r.market_hash_name,
      app_id: r.app_id,
      last_price: r.last_price,
      last_profit,
      history_profit,
      csgoempire: csgoempireDetail,
      rollbit: rollbitDetail
    };
    return response;
  })

  if (pricEmpireSearchRequest.last_profit_from) {
    mappedResult = mappedResult.filter(r => r.last_profit >= pricEmpireSearchRequest.last_profit_from);
  }

  if (pricEmpireSearchRequest.last_profit_to) {
    mappedResult = mappedResult.filter(r => r.last_profit <= pricEmpireSearchRequest.last_profit_to);
  }

  if (pricEmpireSearchRequest.history_profit_from) {
    mappedResult = mappedResult.filter(r => r.history_profit >= pricEmpireSearchRequest.history_profit_from);
  }

  if (pricEmpireSearchRequest.history_profit_to) {
    mappedResult = mappedResult.filter(r => r.history_profit <= pricEmpireSearchRequest.history_profit_to);
  }

  return mappedResult;
}

async function refreshItems() {
  let api = new PricEmpireApi();
  let items = await api.getItemsByName();
  let deleteResult = await PricEmpireItem.default.deleteMany({}).exec();
  await PricEmpireItem.default.insertMany(items);
  return { deleteCount: deleteResult.n, insertCount: items.length };
}

async function refreshItemDetails(ids: number[]) {
  if (ids.length > 10) throw new Error("Maximum 10 items could be selected.");
  let api = new PricEmpireApi();
  ids.forEach(async id => {
    let itemDetail = await api.getItemDetail(id);
    itemDetail.api_selection_date = new Date();
    await PricEmpireItemDetail.default.findOneAndUpdate({id}, itemDetail, { upsert: true, new: true }).exec();
  });
  return "Success";
}

export = {
  searchItems,
  refreshItems,
  refreshItemDetails
}