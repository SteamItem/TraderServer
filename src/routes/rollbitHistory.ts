import express = require('express');
import rollbitHistoryController = require('../controllers/rollbitHistory');

export = (app: express.Express) => {
  app.get('/rollbit', async (_req, res) => {
    const items = await rollbitHistoryController.findAll();
    res.send(items);
  });
}