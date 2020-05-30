import express = require('express');
import cors = require('cors');
import corsHelper = require('../helpers/cors');
import paramController = require('../controllers/botParam');

module.exports = (app: express.Express) => {
  const corsOptions = corsHelper.getCorsOptions();

  app.get('/botParams/:id', cors(corsOptions), async (req, res) => {
    var id = parseInt(req.params.id);
    paramController.findOne(id)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.put('/botParams/:_id', cors(corsOptions), async (req, res) => {
    var id = parseInt(req.params._id);
    paramController.update(id, req.body.worker, req.body.code)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.post('/botParams/login/:id', cors(corsOptions), async (req, res) => {
    var id = parseInt(req.params.id);
    paramController.login(id, req.body)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
}