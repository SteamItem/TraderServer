import express = require('express');
import cors = require('cors');
import corsHelper = require('../helpers/cors');
import wishlistItemController = require('../controllers/wishlistItem');

export = (app: express.Express) => {
  const corsOptions = corsHelper.getCorsOptions();

  app.post('/wishlistItems', cors(corsOptions), async (req, res) => {
    const items = await wishlistItemController.create(req.body);
    res.send(items);
  });
  app.get('/wishlistItems', cors(corsOptions), async (_req, res) => {
    const items = await wishlistItemController.findAll();
    res.send(items);
  });
  app.get('/wishlistItems/:_id', cors(corsOptions), async (req, res) => {
    const item = await wishlistItemController.findOne(req.params._id);
    res.send(item);
  });
  app.put('/wishlistItems/:_id', cors(corsOptions), async (req, res) => {
    const item = await wishlistItemController.update(req.params._id, req.body);
    res.send(item);
  });
  app.delete('/wishlistItems/:_id', cors(corsOptions), async (req, res) => {
    await wishlistItemController.remove(req.params._id);
    res.send({message: "Deleted successfully!"})
  });
}