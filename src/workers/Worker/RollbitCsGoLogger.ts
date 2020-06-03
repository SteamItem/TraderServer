import cron = require('node-cron');
import { IRollbitInventoryItem, IRollbitSocketItem } from '../../interfaces/storeItem';
import { EnumBot } from '../../helpers/enum';
import { WorkerBase } from "./WorkerBase";
import { DatabaseSelectorTask } from '../DatabaseSelector/DatabaseSelectorTask';
import { RollbitCsGoDatabaseSelector } from '../DatabaseSelector/RollbitCsGoDatabaseSelector';
import { RollbitSocket } from '../../api/rollbitSocket';
import { IBotParam } from '../../models/botParam';
import _ = require('lodash');
import db = require('../../db');
import { IRollbitHistory } from '../../interfaces/rollbit';
export class RollbitCsGoLogger extends WorkerBase<IRollbitInventoryItem> {
  private socket: RollbitSocket;
  private syncTimer: NodeJS.Timeout;
  private scheduledTasks: cron.ScheduledTask[] = [];
  initialize() {
    this.socket = new RollbitSocket();
    this.prepareSocketListeners();
  }
  start(botParam: IBotParam): void {
    const that = this;
    that.socket.connect(botParam.cookie);
    that.syncTimer = setInterval(() => {
      console.log("sync sent");
      that.socket.send('sync', '', botParam.cookie, true);
    }, 2500);
    const socketRestartScheduler = this.socketRestartScheduler();
    this.scheduledTasks = [socketRestartScheduler]
  }
  stop(): void {
    this.socket.disconnect();
    clearInterval(this.syncTimer);
    this.scheduledTasks.forEach(st => { st.stop(); });
  }
  private socketRestartScheduler() {
    return cron.schedule('0 * * * *', async () => {
      let currentTask = "socketRestartScheduler";
      try {
        currentTask = "Socket Restarter";
        this.socket.disconnect();
        await this.socket.connect(this.botParam.cookie);
        this.logger.handleMessage(this.botParam.id, currentTask, "Restarted")
      } catch (e) {
        this.handleError(currentTask, e.message);
      }
    });
  }
  private prepareSocketListeners() {
    this.prepareSocketMarketListener();
  }
  getDatabaseSelector(): DatabaseSelectorTask {
    return new RollbitCsGoDatabaseSelector(EnumBot.RollbitCsGoLogger);
  }
  private prepareSocketMarketListener() {
    const that = this;
    that.socket.listen('steam/market', async (item: IRollbitSocketItem) => {
      const normalizedItem = that.normalizeItem(item);
      if (item.state === 'listed') {
        await that.saveListedItem(normalizedItem);
      }
      if (item.state === 'gone') {
        await that.saveGoneItem(normalizedItem);
      }
    })
  }

  private saveListedItem(item: IRollbitHistory) {
    item.listed_at = new Date();
    return db.updateRollbitHistoryListed(item);
  }

  private saveGoneItem(item: IRollbitHistory) {
    item.gone_at = new Date();
    return db.updateRollbitHistoryGone(item);
  }

  private normalizeItem(item: IRollbitSocketItem): IRollbitHistory {
    return {
      ref: item.ref,
      price: item.price,
      markup: item.markup,
      name: item.items.map(ii => ii.name).join("#"),
      weapon: item.items.map(ii => ii.weapon).join("#"),
      skin: item.items.map(ii => ii.skin).join("#"),
      rarity: item.items.map(ii => ii.rarity).join("#"),
      exterior: item.items.map(ii => ii.exterior).join("#"),
      baseprice: _.sumBy(item.items, ii => ii.price)
    };
  }
}
