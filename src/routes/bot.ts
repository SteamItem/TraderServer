import express = require('express');
import cors = require('cors');
import corsHelper = require('../helpers/cors');
import botController = require('../controllers/bot');

export = (app: express.Express) => {
  const corsOptions = corsHelper.getCorsOptions();

  app.get('/bot/:id', cors(corsOptions), async (req, res) => {
    const botId = parseInt(req.params.id);
    botController.findOne(botId)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
}