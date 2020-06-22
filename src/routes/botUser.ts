import express = require('express');
import cors = require('cors');
import corsHelper = require('../helpers/cors');
import botUserController = require('../controllers/botUser');

export = (app: express.Express) => {
  const corsOptions = corsHelper.getCorsOptions();

  app.get('/botUser/all/:id', cors(corsOptions), async (req, res) => {
    const botId = parseInt(req.params.id);
    botUserController.findBots(botId)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.get('/botUser/:id', cors(corsOptions), async (req, res) => {
    botUserController.findOne(req.params.id)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.put('/botUser/:id', cors(corsOptions), async (req, res) => {
    botUserController.update(req.params.id, req.body.worker, req.body.code, req.body.wishlist_id)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.post('/botUser/login/:id', cors(corsOptions), async (req, res) => {
    botUserController.login(req.params.id, req.body)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
}