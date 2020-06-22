import express = require('express');
import cors = require('cors');
import corsHelper = require('../helpers/cors');
import wishlistItemController = require('../controllers/wishlistItem');

export = (app: express.Express) => {
  const corsOptions = corsHelper.getCorsOptions();

  app.post('/wishlistItems/:id', cors(corsOptions), async (req, res) => {
    const items = await wishlistItemController.save(req.params.id, req.body.site_id, req.body.appid, req.body.name, req.body.max_price);
    res.send(items);
  });
  app.get('/wishlistItems/:id', cors(corsOptions), async (req, res) => {
    const items = await wishlistItemController.findAll(req.params.id);
    res.send(items);
  });
  app.get('/wishlistItems/:id/:item_id', cors(corsOptions), async (req, res) => {
    const item = await wishlistItemController.findOne(req.params.id, req.params.item_id);
    res.send(item);
  });
  app.delete('/wishlistItems/:id/:item_id', cors(corsOptions), async (req, res) => {
    await wishlistItemController.remove(req.params.id, req.params.item_id);
    res.send({message: "Deleted successfully!"})
  });
}