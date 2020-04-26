import rollbitController = require('./controllers/rollbit');
import mongoHelper = require('./helpers/mongo');

mongoHelper.connect();

var logger = new rollbitController.RollbitLogger();
logger.startLogging();