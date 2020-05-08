import mongoHelper = require('./helpers/mongo');
import { RollbitCsGoWorker } from "./workers/Worker/RollbitCsGoWorker";
import { TelegramLogger } from './workers/Logger/TelegramLogger';

mongoHelper.connect();

var logger = new TelegramLogger();
var worker = new RollbitCsGoWorker(logger);
worker.schedule();
