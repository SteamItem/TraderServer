import { PricEmpireApi } from "../api/pricEmpire"
import { IPricEmpireSearchRequest } from "../interfaces/pricEmpire";
import { DataApi } from "../api/data";

function searchItems(pricEmpireSearchRequest: IPricEmpireSearchRequest) {
  const data = new DataApi();
  return data.profitSearch(pricEmpireSearchRequest);
}

async function refreshItems() {
  const api = new PricEmpireApi();
  const data = new DataApi();
  const items = await api.getItemsByName();
  await data.updatePricEmpireItems(items);
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
  const data = new DataApi();
  const itemDetail = await api.getItemDetail(id);
  await data.updatePricEmpireItemPrices(itemDetail.prices);
}

export = {
  searchItems,
  refreshItems,
  refreshItemDetails
}