import express = require('express');
import cors = require('cors');
import corsHelper = require('../helpers/cors');
import paramController = require('../controllers/botParam');

module.exports = (app: express.Express) => {
  const corsOptions = corsHelper.getCorsOptions();

  app.get('/params/botStatus/:id', cors(corsOptions), async (req, res) => {
    var id = parseInt(req.params.id);
    var status = await paramController.getWorker(id);
    res.send(status);
  });
  app.get('/params/startBot/:id', cors(corsOptions), async (req, res) => {
    var id = parseInt(req.params.id);
    var status = await paramController.updateWorker(id, true);
    res.send(status);
  });
  app.get('/params/stopBot/:id', cors(corsOptions), async (req, res) => {
    var id = parseInt(req.params.id);
    var status = await paramController.updateWorker(id, false);
    res.send(status);
  });
}