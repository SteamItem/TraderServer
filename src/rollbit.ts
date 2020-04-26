import rollbitController = require('./controllers/rollbitLogger');
import mongoHelper = require('./helpers/mongo');

mongoHelper.connect();

var logger = new rollbitController.RollbitLogger();
logger.startLogging();