import mongoHelper = require('./helpers/mongo');
import db = require('./db');
import worker = require('./workers/Worker/Worker');

mongoHelper.connect();
db.sync();

const bot = new worker.Worker();
bot.work();
