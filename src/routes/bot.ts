import express = require('express');
import { BotController } from '../controllers/BotController';
import { EnumBot } from '../helpers/enum';
import BotRepository = require('../repositories/BotRepository');

export = (app: express.Express) => {
  const repository = new BotRepository();
  const controller = new BotController(repository);

  app.get('/bot/csgoEmpire', (req, res) => {
    const typeId = EnumBot.CsGoEmpire;
    controller.findByTypeId(typeId)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.post('/bot/csgoEmpire', (req, res) => {
    const type = EnumBot.CsGoEmpire;
    controller.create(type, req.body.name)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.get('/bot/csgoEmpire/:botId', (req, res) => {
    const botId = req.params.botId;
    controller.findById(botId)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.put('/bot/csgoEmpire/:botId', (req, res) => {
    const botId = req.params.botId;
    const type = EnumBot.CsGoEmpire;
    controller.update(botId, type, req.body.name, req.body.worker, req.body.code)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.delete('/bot/csgoEmpire/:botId', (req, res) => {
    const botId = req.params.botId;
    controller.remove(botId)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.post('/bot/csgoEmpire/login/:botId', (req, res) => {
    const botId = req.params.botId;
    controller.login(botId, req.body)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });

  app.get('/bot/rollbit', (req, res) => {
    const typeId = EnumBot.Rollbit;
    controller.findByTypeId(typeId)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.post('/bot/rollbit', (req, res) => {
    const type = EnumBot.Rollbit;
    controller.create(type, req.body.name)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.get('/bot/rollbit/:botId', (req, res) => {
    const botId = req.params.botId;
    controller.findById(botId)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.put('/bot/rollbit/:botId', (req, res) => {
    const botId = req.params.botId;
    const type = EnumBot.Rollbit;
    controller.update(botId, type, req.body.name, req.body.worker, req.body.code)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.delete('/bot/rollbit/:botId', (req, res) => {
    const botId = req.params.botId;
    controller.remove(botId)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.post('/bot/rollbit/login/:botId', (req, res) => {
    const botId = req.params.botId;
    controller.login(botId, req.body)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });

  app.get('/bot/duelbits', (req, res) => {
    const typeId = EnumBot.Duelbits;
    controller.findByTypeId(typeId)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.post('/bot/duelbits', (req, res) => {
    const type = EnumBot.Duelbits;
    controller.create(type, req.body.name)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.get('/bot/duelbits/:botId', (req, res) => {
    const botId = req.params.botId;
    controller.findById(botId)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.put('/bot/duelbits/:botId', (req, res) => {
    const botId = req.params.botId;
    const type = EnumBot.Duelbits;
    controller.update(botId, type, req.body.name, req.body.worker, req.body.code)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.delete('/bot/duelbits/:botId', (req, res) => {
    const botId = req.params.botId;
    controller.remove(botId)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.post('/bot/duelbits/login/:botId', (req, res) => {
    const botId = req.params.botId;
    controller.login(botId, req.body)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
}