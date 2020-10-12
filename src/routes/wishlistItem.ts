import express = require('express');
import cors = require('cors');
import corsHelper = require('../helpers/cors');
import { WishlistItemController } from '../controllers/WishlistItemController';
import WishlistItemRepository = require('../repositories/WishlistItemRepository');

export = (app: express.Express) => {
  const corsOptions = corsHelper.getCorsOptions();
  const repository = new WishlistItemRepository();
  const controller = new WishlistItemController(repository);

  app.post('/wishlistItems', cors(corsOptions), async (req, res) => {
    const items = await controller.create(req.body.site_id, req.body.appid, req.body.name, req.body.max_price);
    res.send(items);
  });
  app.get('/wishlistItems', cors(corsOptions), async (_req, res) => {
    const items = await controller.findAll();
    res.send(items);
  });
  app.get('/wishlistItems/:_id', cors(corsOptions), async (req, res) => {
    const item = await controller.findOne(req.params._id);
    res.send(item);
  });
  app.put('/wishlistItems/:_id', cors(corsOptions), async (req, res) => {
    const item = await controller.update(req.params._id, req.body.site_id, req.body.appid, req.body.name, req.body.max_price);
    res.send(item);
  });
  app.delete('/wishlistItems/:_id', cors(corsOptions), async (req, res) => {
    await controller.remove(req.params._id);
    res.send({message: "Deleted successfully!"})
  });
}