import mongoHelper = require('./helpers/mongo');
import { EmpireDotaWorker } from "./workers/Worker/EmpireDotaWorker";
import { TelegramLogger } from './workers/Logger/TelegramLogger';

mongoHelper.connect();

var logger = new TelegramLogger();
var worker = new EmpireDotaWorker(logger);
worker.schedule();