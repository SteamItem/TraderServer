import RollbitFav = require('../models/rollbitFav');

async function findAll() {
  return RollbitFav.default.find();
}

async function addToFavorites(name: string) {
  await removeFromFavorites(name);
  const fav = new RollbitFav.default({ name });
  return await fav.save();
}

async function removeFromFavorites(name: string) {
  return await RollbitFav.default.findOneAndRemove({name});
}

export = {
  findAll,
  addToFavorites,
  removeFromFavorites
}