import express = require('express');
import cors = require('cors');
import corsHelper = require('../helpers/cors');
import pricEmpireController = require('../controllers/pricEmpire');

module.exports = (app: express.Express) => {
  const corsOptions = corsHelper.getCorsOptions();

  app.post('/pricEmpire/searchItems', cors(corsOptions), async (req, res) => {
    pricEmpireController.searchItems(req.body)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });

  app.get('/pricEmpire/refreshItems', cors(corsOptions), async (req, res) => {
    pricEmpireController.refreshItems()
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });

  app.post('/pricEmpire/refreshItemDetails', cors(corsOptions), async (req, res) => {
    pricEmpireController.refreshItemDetails(req.body)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
}