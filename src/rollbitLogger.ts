import mongoHelper = require('./helpers/mongo');
import { RollbitLogger } from './controllers/rollbitLogger';

mongoHelper.connect();

var logger = new RollbitLogger();
logger.startLogging();