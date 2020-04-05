module.exports = (app) => {
    const csgo = require('../controllers/csgo.js');

    app.get('/csgo/token', csgo.getToken);
};
