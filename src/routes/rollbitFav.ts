import express = require('express');
import cors = require('cors');
import corsHelper = require('../helpers/cors');
import rollbitFavController = require('../controllers/rollbitFav');

module.exports = (app: express.Express) => {
  const corsOptions = corsHelper.getCorsOptions();

  app.post('/rollbitFav/add', cors(corsOptions), async (req, res) => {
    var items = await rollbitFavController.addToFavorites(req.body.name);
    res.send(items);
  });

  app.post('/rollbitFav/remove', cors(corsOptions), async (req, res) => {
    var items = await rollbitFavController.removeFromFavorites(req.body.name);
    res.send(items);
  });
}