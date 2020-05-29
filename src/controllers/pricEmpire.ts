import { PricEmpireApi } from "./api/pricEmpire"
import { IPricEmpireSearchRequest } from "../interfaces/pricEmpire";
import db = require("../db");

function searchItems(pricEmpireSearchRequest: IPricEmpireSearchRequest) {
  return db.profitSearch(pricEmpireSearchRequest);
}

async function refreshItems() {
  let api = new PricEmpireApi();
  let items = await api.getItemsByName();
  await db.updatePricEmpireItems(items);
  return "Success";
}

async function refreshItemDetails(ids: number[]) {
  if (ids.length > 10) throw new Error("Maximum 10 items could be selected.");
  let promises = [];
  ids.forEach(id => {
    let promise = refreshItemDetail(id);
    promises.push(promise);
  });
  await Promise.all(promises);
  return "Success";
}

async function refreshItemDetail(id: number) {
  let api = new PricEmpireApi();
  let itemDetail = await api.getItemDetail(id);
  await db.updatePricEmpireItemPrices(itemDetail.prices);
}

export = {
  searchItems,
  refreshItems,
  refreshItemDetails
}