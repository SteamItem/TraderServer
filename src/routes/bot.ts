import express = require('express');
import cors = require('cors');
import corsHelper = require('../helpers/cors');
import botController = require('../controllers/bot');

export = (app: express.Express) => {
  const corsOptions = corsHelper.getCorsOptions();

  app.get('/botParams/:id', cors(corsOptions), async (req, res) => {
    const id = req.params.id;
    botController.findById(id)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.put('/botParams/:_id', cors(corsOptions), async (req, res) => {
    const id = req.params.id;
    botController.update(id, req.body.worker, req.body.code)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.post('/botParams/login/:id', cors(corsOptions), async (req, res) => {
    const id = parseInt(req.params.id);
    botController.login(id, req.body)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
}