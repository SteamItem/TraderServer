import express = require('express');
import cors = require('cors');
import corsHelper = require('../helpers/cors');
import wishlistController = require('../controllers/wishlist');

export = (app: express.Express) => {
  const corsOptions = corsHelper.getCorsOptions();

  app.get('/wishlist', cors(corsOptions), async (_req, res) => {
    const items = await wishlistController.findAll();
    res.send(items);
  });
  app.get('/wishlist/:id', cors(corsOptions), async (req, res) => {
    const item = await wishlistController.findOne(req.params.id);
    res.send(item);
  });
}