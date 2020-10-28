import express = require('express');
import common = require('./common');
import wishlistItem = require('./wishlistItem');
import bot = require('./bot');
import rollbitHistory = require('./rollbitHistory');
import pricEmpire = require('./pricEmpire');
import helpers from '../helpers';

function registerRoutes(app: express.Express) {
  app.use(helpers.setUserId);
  common(app);
  wishlistItem(app);
  bot(app);
  rollbitHistory(app);
  pricEmpire(app);
}

export {
  registerRoutes
}