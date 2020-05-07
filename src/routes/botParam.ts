import express = require('express');
import cors = require('cors');
import corsHelper = require('../helpers/cors');
import paramController = require('../controllers/botParam');

module.exports = (app: express.Express) => {
  const corsOptions = corsHelper.getCorsOptions();

  app.get('/botParams/:id', cors(corsOptions), async (req, res) => {
    var id = parseInt(req.params.id);
    var status = await paramController.findOne(id);
    res.send(status);
  });
  app.put('/botParams/:_id', cors(corsOptions), async (req, res) => {
    var id = parseInt(req.params._id);
    var item = await paramController.update(id, req.body.worker, req.body.code, req.body.cookie);
    res.send(item);
  });
}