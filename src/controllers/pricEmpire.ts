import { PricEmpireApi } from "../api/pricEmpire"
import { IPricEmpireSearchRequest } from "../interfaces/pricEmpire";
import db = require("../db");

function searchItems(pricEmpireSearchRequest: IPricEmpireSearchRequest) {
  return db.profitSearch(pricEmpireSearchRequest);
}

async function refreshItems() {
  const api = new PricEmpireApi();
  const items = await api.getItemsByName();
  await db.updatePricEmpireItems(items);
  return "Success";
}

async function refreshItemDetails(ids: number[]) {
  if (ids.length > 10) throw new Error("Maximum 10 items could be selected.");
  const promises = [];
  ids.forEach(id => {
    const promise = refreshItemDetail(id);
    promises.push(promise);
  });
  await Promise.all(promises);
  return "Success";
}

async function refreshItemDetail(id: number) {
  const api = new PricEmpireApi();
  const itemDetail = await api.getItemDetail(id);
  await db.updatePricEmpireItemPrices(itemDetail.prices);
}

export = {
  searchItems,
  refreshItems,
  refreshItemDetails
}