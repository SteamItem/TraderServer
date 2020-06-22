import config = require('../../config');
import botUserController = require('../../controllers/botUser');
import { WorkerBase } from './WorkerBase';
import { EnumBot } from '../../helpers/enum';
import { EmpireInstantWorker } from './EmpireInstantWorker';
import { EmpireDotaWorker } from './EmpireDotaWorker';
import { RollbitCsGoWorker } from './RollbitCsGoWorker';
import { RollbitCsGoLogger } from './RollbitCsGoLogger';
import { TelegramLogger } from '../Logger/TelegramLogger';
import { RollbitApi } from '../../api/rollbit';
export class Worker {
  async work(): Promise<void> {
    const botUser = await botUserController.findOne(config.BOTUSER_ID);
    const worker = this.getWorker(botUser.botid);
    worker.schedule();
  }

  private getWorker(botid: number) {
    let worker: WorkerBase;
    const logger = new TelegramLogger();
    const api = new RollbitApi();
    switch (botid) {
      case EnumBot.EmpireInstant:
        worker = new EmpireInstantWorker(logger);
        break;
      case EnumBot.EmpireDota:
        worker = new EmpireDotaWorker(logger);
        break;
      case EnumBot.RollbitCsGo:
        worker = new RollbitCsGoWorker(api, logger);
        break;
      case EnumBot.RollbitCsGoLogger:
        worker = new RollbitCsGoLogger(logger);
        break;
    }
    return worker;
  }
}
