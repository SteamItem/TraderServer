import { LoggerBase } from '../Logger/LoggerBase';
import { WorkerUnit } from './WorkerUnit';
export abstract class WorkerTask extends WorkerUnit {
  constructor(logger: LoggerBase) {
    super();
    this.logger = logger;
  }
  protected logger: LoggerBase;
  abstract async work(): Promise<any>;
}
