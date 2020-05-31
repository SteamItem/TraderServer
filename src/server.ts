import express = require('express');
import bodyParser = require('body-parser');
import cors = require('cors');
import mongoHelper = require('./helpers/mongo');
import db = require('./db');
import botParam = require('./controllers/botParam');
const PORT = process.env.PORT || 3000;

// create express app
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

mongoHelper.connect();
db.sync();

require('./routes/index')(app);
require('./routes/wishlistItem')(app);
require('./routes/botParam')(app);
require('./routes/telegram')(app);
require('./routes/rollbitHistory')(app);
require('./routes/rollbitFav')(app);
require('./routes/pricEmpire')(app);

botParam.handleBots();

// listen for requests
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
