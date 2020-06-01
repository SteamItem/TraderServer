import express = require('express');
import common = require('./common');
import wishlistItem = require('./wishlistItem');
import botParam = require('./botParam');
import telegram = require('./telegram');
import rollbitHistory = require('./rollbitHistory');
import rollbitFav = require('./rollbitFav');
import pricEmpire = require('./pricEmpire');

function registerRoutes(app: express.Express) {
  common(app);
  wishlistItem(app);
  botParam(app);
  telegram(app);
  rollbitHistory(app);
  rollbitFav(app);
  pricEmpire(app);
}

export {
  registerRoutes
}