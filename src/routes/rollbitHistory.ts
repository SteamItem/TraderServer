import express = require('express');
import cors = require('cors');
import corsHelper = require('../helpers/cors');
import rollbitHistoryController = require('../controllers/rollbitHistory');

module.exports = (app: express.Express) => {
  const corsOptions = corsHelper.getCorsOptions();

  app.get('/rollbit', cors(corsOptions), async (_req, res) => {
    var items = await rollbitHistoryController.findAll();
    res.send(items);
  });
}