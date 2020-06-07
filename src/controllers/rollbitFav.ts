import db = require('../db');

async function findAll() {
  return db.rollbitFavs();
}

async function addToFavorites(name: string) {
  await removeFromFavorites(name);
  const result = await db.rollbitFavAdd(name);
  return result;
}

function removeFromFavorites(name: string): Promise<number> {
  return db.rollbitFavRemove(name);
}

export = {
  findAll,
  addToFavorites,
  removeFromFavorites
}