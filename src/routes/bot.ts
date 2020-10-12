import express = require('express');
import cors = require('cors');
import corsHelper = require('../helpers/cors');
import { BotController } from '../controllers/BotController';
import BotRepository = require('../repositories/BotRepository');

export = (app: express.Express) => {
  const corsOptions = corsHelper.getCorsOptions();
  const repository = new BotRepository();
  const controller = new BotController(repository);

  app.get('/botList/:typeId', cors(corsOptions), async (req, res) => {
    const typeId = parseInt(req.params.typeId);
    controller.findByTypeId(typeId)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.post('/bot', cors(corsOptions), async (req, res) => {
    controller.create(req.body.type, req.body.name)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.put('/bot/:botId', cors(corsOptions), async (req, res) => {
    const botId = req.params.botId;
    controller.update(botId, req.body.worker, req.body.code)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.delete('/bot/:botId', cors(corsOptions), async (req, res) => {
    const botId = req.params.botId;
    controller.remove(botId)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.post('/bot/login/:botId', cors(corsOptions), async (req, res) => {
    const botId = req.params.botId;
    controller.login(botId, req.body)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
}