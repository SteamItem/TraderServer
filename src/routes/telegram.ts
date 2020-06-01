import express = require('express');
import cors = require('cors');
import corsHelper = require('../helpers/cors');
import telegramController = require('../controllers/telegram');

export = (app: express.Express) => {
  const corsOptions = corsHelper.getCorsOptions();

  app.post('/telegram/sendMessage', cors(corsOptions), async (req, res) => {
    const message = await telegramController.sendMessage(req.body.message);
    res.send(message);
  });
}