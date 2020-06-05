import { RollbitCsGoWorker } from "./workers/Worker/RollbitCsGoWorker";
import { TelegramLogger } from './workers/Logger/TelegramLogger';

const logger = new TelegramLogger();
const worker = new RollbitCsGoWorker(logger);
worker.schedule();
