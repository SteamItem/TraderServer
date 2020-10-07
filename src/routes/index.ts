import express = require('express');
import common = require('./common');
import wishlistItem = require('./wishlistItem');
import bot = require('./bot');
import rollbitHistory = require('./rollbitHistory');
import pricEmpire = require('./pricEmpire');

function registerRoutes(app: express.Express) {
  common(app);
  wishlistItem(app);
  bot(app);
  rollbitHistory(app);
  pricEmpire(app);
}

export {
  registerRoutes
}