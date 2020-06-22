import express = require('express');
import common = require('./common');
import wishlist = require('./wishlist');
import wishlistItem = require('./wishlistItem');
import bot = require('./bot');
import botUser = require('./botUser');
import telegram = require('./telegram');
import rollbitHistory = require('./rollbitHistory');
import rollbitFav = require('./rollbitFav');
import pricEmpire = require('./pricEmpire');

function registerRoutes(app: express.Express) {
  common(app);
  wishlist(app);
  wishlistItem(app);
  bot(app);
  botUser(app);
  telegram(app);
  rollbitHistory(app);
  rollbitFav(app);
  pricEmpire(app);
}

export {
  registerRoutes
}