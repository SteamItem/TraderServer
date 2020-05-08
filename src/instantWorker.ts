import mongoHelper = require('./helpers/mongo');
import { EmpireInstantWorker } from "./workers/Worker/EmpireInstantWorker";
import { TelegramLogger } from './workers/Logger/TelegramLogger';

mongoHelper.connect();

var logger = new TelegramLogger();
var worker = new EmpireInstantWorker(logger);
worker.schedule();