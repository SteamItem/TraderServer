import mongoHelper = require('./helpers/mongo');
import { EmpireTradeLockLogger } from "./workers/Worker/EmpireTradeLockLogger";
import { TelegramLogger } from './workers/Logger/TelegramLogger';

mongoHelper.connect();

const logger = new TelegramLogger();
const worker = new EmpireTradeLockLogger(logger);
worker.schedule();