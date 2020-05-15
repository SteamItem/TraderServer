import RollbitHistory = require('../models/rollbitHistory');
import RollbitFav = require('../models/rollbitFav');

async function findAll() {
  var histories = await RollbitHistory.default.find();
  var favs = await RollbitFav.default.find();
  var returnItems: any[] = [];
  histories.forEach(history => {
    var isFav = favs.filter(f => f.name === history.name).length > 0;
    returnItems.push({
      name: history.name,
      price: history.price,
      markup: history.markup,
      baseprice: history.baseprice,
      listed_at: history.listed_at,
      gone_at: history.gone_at,
      fav: isFav
    })
  });
  return returnItems;
}

export = {
  findAll,
}