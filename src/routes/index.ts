import express = require('express');

module.exports = (app: express.Express) => {
  app.get('/', (_req, res) => {
    res.send("Hello World");
  });
}