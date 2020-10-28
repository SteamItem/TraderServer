import express = require('express');
import { WishlistItemController } from '../controllers/WishlistItemController';
import WishlistItemRepository = require('../repositories/WishlistItemRepository');

export = (app: express.Express) => {
  const repository = new WishlistItemRepository();
  const controller = new WishlistItemController(repository);

  app.get('/wishlistItems/csgoEmpire/:botId', (req, res) => {
    const botId = req.params.botId;
    controller.findByBot(botId)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.post('/wishlistItems/csgoEmpire/:botId', (req, res) => {
    const botId = req.params.botId;
    controller.create(botId, req.body.name, req.body.max_price)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.put('/wishlistItems/csgoEmpire/:botId/:itemId', (req, res) => {
    const botId = req.params.botId;
    const itemId = req.params.itemId;
    controller.update(botId, itemId, req.body.name, req.body.max_price)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.delete('/wishlistItems/csgoEmpire/:botId/:itemId', (req, res) => {
    const botId = req.params.botId;
    const itemId = req.params.itemId;
    controller.remove(itemId)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });

  app.get('/wishlistItems/rollbit/:botId', (req, res) => {
    const botId = req.params.botId;
    controller.findByBot(botId)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.post('/wishlistItems/rollbit/:botId', (req, res) => {
    const botId = req.params.botId;
    controller.create(botId, req.body.name, req.body.max_price)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.put('/wishlistItems/rollbit/:botId/:itemId', (req, res) => {
    const botId = req.params.botId;
    const itemId = req.params.itemId;
    controller.update(botId, itemId, req.body.name, req.body.max_price)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.delete('/wishlistItems/rollbit/:botId/:itemId', (req, res) => {
    const botId = req.params.botId;
    const itemId = req.params.itemId;
    controller.remove(itemId)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });

  app.get('/wishlistItems/duelbits/:botId', (req, res) => {
    const botId = req.params.botId;
    controller.findByBot(botId)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.post('/wishlistItems/duelbits/:botId', (req, res) => {
    const botId = req.params.botId;
    controller.create(botId, req.body.name, req.body.max_price)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.put('/wishlistItems/duelbits/:botId/:itemId', (req, res) => {
    const botId = req.params.botId;
    const itemId = req.params.itemId;
    controller.update(botId, itemId, req.body.name, req.body.max_price)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.delete('/wishlistItems/duelbits/:botId/:itemId', (req, res) => {
    const botId = req.params.botId;
    const itemId = req.params.itemId;
    controller.remove(itemId)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
}