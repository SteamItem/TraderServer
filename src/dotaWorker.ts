import { EmpireDotaWorker } from "./workers/Worker/EmpireDotaWorker";
import { TelegramLogger } from './workers/Logger/TelegramLogger';

const logger = new TelegramLogger();
const worker = new EmpireDotaWorker(logger);
worker.schedule();