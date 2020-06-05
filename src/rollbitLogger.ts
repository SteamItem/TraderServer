import { RollbitCsGoLogger } from "./workers/Worker/RollbitCsGoLogger";
import { TelegramLogger } from './workers/Logger/TelegramLogger';

const logger = new TelegramLogger();
const worker = new RollbitCsGoLogger(logger);
worker.schedule();
