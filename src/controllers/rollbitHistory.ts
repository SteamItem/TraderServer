import db = require('../db');
import { IRollbitHistoryView } from '../interfaces/rollbit';

async function findAll(): Promise<IRollbitHistoryView[]> {
  const histories = await db.rollbitHistories();
  const returnItems: IRollbitHistoryView[] = [];
  histories.forEach(history => {
    returnItems.push({
      name: history.name,
      price: history.price,
      markup: history.markup,
      baseprice: history.baseprice,
      listed_at: history.listed_at,
      gone_at: history.gone_at
    })
  });
  return returnItems;
}

export = {
  findAll,
}