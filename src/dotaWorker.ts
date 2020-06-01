import mongoHelper = require('./helpers/mongo');
import { EmpireDotaWorker } from "./workers/Worker/EmpireDotaWorker";
import { TelegramLogger } from './workers/Logger/TelegramLogger';

mongoHelper.connect();

const logger = new TelegramLogger();
const worker = new EmpireDotaWorker(logger);
worker.schedule();