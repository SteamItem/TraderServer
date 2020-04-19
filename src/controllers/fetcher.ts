import axios from 'axios';
import paramController = require('./param');
import helpers = require('../helpers');
import config = require('../config');

export class Fetcher {
  public async fetch() {
    var that = this;
    var workerStatus = await that.getWorkerStatus();
    if (workerStatus === true) {
      await this.fetchUrl();
      await helpers.sleep(15 * 60 * 1000);
    } else {
      await helpers.sleep(1000);
    }
    that.fetch();
  }

  private async getWorkerStatus() {
    var workerStatusParam = await paramController.getWorkerStatus();
    if (!workerStatusParam) throw new Error("Worker status not found");
    var workerStatus = Boolean(workerStatusParam.value);
    return workerStatus;
  }

  private async fetchUrl() {
    return await axios.get(config.WEB_URL);
  }
}
