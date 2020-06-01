import express = require('express');
import cors = require('cors');
import corsHelper = require('../helpers/cors');
import rollbitFavController = require('../controllers/rollbitFav');

export = (app: express.Express) => {
  const corsOptions = corsHelper.getCorsOptions();

  app.get('/rollbitFav', cors(corsOptions), async (_req, res) => {
    const items = await rollbitFavController.findAll();
    res.send(items);
  });

  app.post('/rollbitFav/add', cors(corsOptions), async (req, res) => {
    const items = await rollbitFavController.addToFavorites(req.body.name);
    res.send(items);
  });

  app.post('/rollbitFav/remove', cors(corsOptions), async (req, res) => {
    const items = await rollbitFavController.removeFromFavorites(req.body.name);
    res.send(items);
  });
}