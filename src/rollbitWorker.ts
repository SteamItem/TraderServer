import mongoHelper = require('./helpers/mongo');
import { RollbitCsGoWorker } from "./workers/Worker/RollbitCsGoWorker";
import { TelegramLogger } from './workers/Logger/TelegramLogger';

mongoHelper.connect();

const logger = new TelegramLogger();
const worker = new RollbitCsGoWorker(logger);
worker.schedule();
