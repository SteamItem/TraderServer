import cron = require('node-cron');
import { RollbitInventoryFilterer } from '../InventoryFilterer/RollbitInventoryFilterer';
import { RollbitWithdrawMakerTask } from '../WithdrawMaker/RollbitWithdrawMakerTask';
import { RollbitBase } from './RollbitBase';
import { EnumBot } from '../../helpers/enum';
import { IRollbitSocketItem, IRollbitSocketBalance } from '../../interfaces/rollbit';
import { IBotParam } from '../../models/botParam';
import { RollbitApi } from '../../api/rollbit';
import { LoggerBase } from '../Logger/LoggerBase';
import db = require('../../db');
export class RollbitCsGoWorker extends RollbitBase {
  bot = EnumBot.RollbitCsGo;
  private balance: number;
  private api: RollbitApi;
  protected botParam: IBotParam;

  constructor(api: RollbitApi, logger: LoggerBase) {
    super(logger);
    this.api = api;
  }

  start(botParam: IBotParam): void {
    super.start(botParam);
    this.botParam = botParam;
    this.inventoryGetter();
  }

  private inventoryGetter() {
    return cron.schedule('*/15 * * * * *', async () => {
      await this.api.csgoInventory(this.botParam.cookie);
      await db.addAgentStatus('inventoryGetter/httpAgent', this.api.httpAgent.getCurrentStatus());
      await db.addAgentStatus('inventoryGetter/httpsAgent', this.api.httpsAgent.getCurrentStatus());
    });
  }

  async onSteamMarketItem(item: IRollbitSocketItem): Promise<void> {
    if (item.state === 'listed') {
      await this.inventoryOperation(item);
    }
  }

  private async inventoryOperation(item: IRollbitSocketItem) {
    let currentTask = "inventoryOperation";
    const newItemDate = new Date();
    try {
      const inventoryFilterer = new RollbitInventoryFilterer(this.balance, [item], this.wishlistItems);
      currentTask = inventoryFilterer.taskName;
      inventoryFilterer.filter();

      const afterFilterDate = new Date();

      const withdrawMaker = new RollbitWithdrawMakerTask(this.api, this.botParam, inventoryFilterer.itemsToBuy);
      currentTask = withdrawMaker.taskName;
      await withdrawMaker.work();

      const afterWithdrawDate = new Date();
      const filterTime = afterFilterDate.getTime() - newItemDate.getTime();
      const withdrawTime = afterWithdrawDate.getTime() - afterFilterDate.getTime();
      const totalTime = afterWithdrawDate.getTime() - newItemDate.getTime();

      withdrawMaker.successWithdrawResult.forEach(r => {
        this.handleMessage(currentTask, `${r.name} withdrawn for ${r.price} in ${totalTime} ms`);
      });
      withdrawMaker.failWithdrawResult.forEach(r => {
        this.handleError(currentTask, `${r.name} withdraw failed ${r.price} in ${totalTime} ms - ${r.message}`);
      });
      const timing = {
        source: "Rollbit",
        name: item.items[0].name,
        price: item.price,
        filterTime,
        withdrawTime,
        successWithdrawCount: withdrawMaker.successWithdrawResult.length,
        failWithdrawCount: withdrawMaker.failWithdrawResult.length
      }
      db.addInventoryOperationTiming(timing);
    } catch (e) {
      this.handleError(currentTask, e.message);
    }
  }

  onBalance(socketBalance: IRollbitSocketBalance): void {
    this.balance = socketBalance.balance / 100;
    const type = socketBalance.type || "Initial"
    const message = `Current Balance: ${this.balance} - ${type}`;
    this.handleMessage("Balance", message);
  }
}
