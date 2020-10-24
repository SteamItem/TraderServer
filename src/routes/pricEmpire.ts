import express = require('express');
import pricEmpireController = require('../controllers/pricEmpire');

export = (app: express.Express) => {
  app.post('/pricEmpire/searchItems', async (req, res) => {
    pricEmpireController.searchItems(req.body)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });

  app.get('/pricEmpire/refreshItems', async (req, res) => {
    pricEmpireController.refreshItems()
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });

  app.post('/pricEmpire/refreshItemDetails', async (req, res) => {
    pricEmpireController.refreshItemDetails(req.body)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
}