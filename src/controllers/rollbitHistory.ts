import db = require('../db');
import { IRollbitHistoryView } from '../interfaces/rollbit';

async function findAll(): Promise<IRollbitHistoryView[]> {
  const histories = await db.rollbitHistories();
  const favs = await db.rollbitFavs();
  const returnItems: IRollbitHistoryView[] = [];
  histories.forEach(history => {
    const isFav = favs.filter(f => f.name === history.name).length > 0;
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