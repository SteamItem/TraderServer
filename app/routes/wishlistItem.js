module.exports = (app) => {
    const items = require('../controllers/wishlistItem.js');

    app.post('/wishlistItems', items.create);
    app.get('/wishlistItems', items.findAll);
    app.get('/wishlistItems/:itemId', items.findOne);
    app.put('/wishlistItems/:itemId', items.update);
    app.delete('/wishlistItems/:itemId', items.delete);
}
