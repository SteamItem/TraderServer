import mongoHelper = require('./helpers/mongo');
import { RollbitCsGoLogger } from "./workers/Worker/RollbitCsGoLogger";
import { TelegramLogger } from './workers/Logger/TelegramLogger';

mongoHelper.connect();

var logger = new TelegramLogger();
var worker = new RollbitCsGoLogger(logger);
worker.schedule();
