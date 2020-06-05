import { DataApi } from "../api/data";
import { IWishlistItem } from "../interfaces/common";

async function findOne(itemId: string): Promise<IWishlistItem> {
  const data = new DataApi();
  return await data.findWishlistItem(itemId);
}

async function findAll(): Promise<IWishlistItem[]> {
  const data = new DataApi();
  return await data.findAllWishlistItems();
}

async function create(item: IWishlistItem): Promise<IWishlistItem> {
  const data = new DataApi();
  return await data.createWishlistItem(item);
}

async function update(itemId: string, item: IWishlistItem) {
  const data = new DataApi();
  return await data.updateWishlistItem(itemId, item);
}

async function remove(itemId: string) {
  const data = new DataApi();
  return await data.deleteWishlistItem(itemId);
}

export = {
    findOne,
    findAll,
    create,
    update,
    remove
}