import db = require('../db');

async function findAll() {
  return db.rollbitFavs();
}

async function addToFavorites(name: string) {
  await removeFromFavorites(name);
  await db.rollbitFavAdd(name);
  return;
}

async function removeFromFavorites(name: string) {
  await db.rollbitFavRemove(name);
  return;
}

export = {
  findAll,
  addToFavorites,
  removeFromFavorites
}