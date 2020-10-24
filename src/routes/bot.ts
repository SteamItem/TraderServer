import express = require('express');
import cors = require('cors');
import { BotController } from '../controllers/BotController';
import BotRepository = require('../repositories/BotRepository');

export = (app: express.Express) => {
  const repository = new BotRepository();
  const controller = new BotController(repository);

  app.get('/bot/list/:typeId', async (req, res) => {
    const typeId = parseInt(req.params.typeId);
    controller.findByTypeId(typeId)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.post('/bot', async (req, res) => {
    controller.create(req.body.type, req.body.name)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.put('/bot/:botId', async (req, res) => {
    const botId = req.params.botId;
    controller.update(botId, req.body.type, req.body.name, req.body.worker, req.body.code)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.delete('/bot/:botId', async (req, res) => {
    const botId = req.params.botId;
    controller.remove(botId)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.post('/bot/login/:botId', async (req, res) => {
    const botId = req.params.botId;
    controller.login(botId, req.body)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
}