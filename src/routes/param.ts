import express = require('express');
import cors = require('cors');
import corsHelper = require('../helpers/cors');
import paramController = require('../controllers/param');

module.exports = (app: express.Express) => {
  const corsOptions = corsHelper.getCorsOptions();

  app.get('/params/botStatus', cors(corsOptions), async (req, res) => {
    var status = await paramController.getWorkerStatus();
    res.send(status);
  });
  app.get('/params/botStatus/start', cors(corsOptions), async (_req, res) => {
    var status = await paramController.startWorker();
    res.send(status);
  });
  app.get('/params/botStatus/stop', cors(corsOptions), async (_req, res) => {
    var status = await paramController.stopWorker();
    res.send(status);
  });
}