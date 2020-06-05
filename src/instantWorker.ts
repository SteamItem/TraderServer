import { EmpireInstantWorker } from "./workers/Worker/EmpireInstantWorker";
import { TelegramLogger } from './workers/Logger/TelegramLogger';

const logger = new TelegramLogger();
const worker = new EmpireInstantWorker(logger);
worker.schedule();