import { DataApi } from "../api/data";

function findAll() {
  const data = new DataApi();
  return data.findRollbitFavs();
}

function addToFavorites(name: string) {
  const data = new DataApi();
  return data.addRollbitFav(name);
}

async function removeFromFavorites(name: string) {
  const data = new DataApi();
  return data.deleteRollbitFav(name);
}

export = {
  findAll,
  addToFavorites,
  removeFromFavorites
}