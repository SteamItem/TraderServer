import express = require('express');
import cors = require('cors');
import corsHelper = require('../helpers/cors');
import wishlistItemController = require('../controllers/wishlistItem');

module.exports = (app: express.Express) => {
  const corsOptions = corsHelper.getCorsOptions();

  app.post('/wishlistItems', cors(corsOptions), async (req, res) => {
    var items = await wishlistItemController.create(req.body.site_id, req.body.appid, req.body.name, req.body.max_price);
    res.send(items);
  });
  app.get('/wishlistItems', cors(corsOptions), async (_req, res) => {
    var items = await wishlistItemController.findAll();
    res.send(items);
  });
  app.get('/wishlistItems/:_id', cors(corsOptions), async (req, res) => {
    var item = await wishlistItemController.findOne(req.params._id);
    res.send(item);
  });
  app.put('/wishlistItems/:_id', cors(corsOptions), async (req, res) => {
    var item = await wishlistItemController.update(req.params._id, req.body.site_id, req.body.appid, req.body.name, req.body.max_price);
    res.send(item);
  });
  app.delete('/wishlistItems/:_id', cors(corsOptions), async (req, res) => {
    await wishlistItemController.remove(req.params._id);
    res.send({message: "Deleted successfully!"})
  });
}