module.exports = (app) => {
    const handler = require('../controllers/workerHandler.js');

    app.get('/worker/start', handler.start);
    app.get('/worker/stop', handler.stop);
    app.get('/worker/restart', handler.restart);
};
