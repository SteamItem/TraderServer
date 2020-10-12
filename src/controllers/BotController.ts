import { EnumBot, getBotText, EnumSite } from '../helpers/enum';
import { ISteamLogin } from '../interfaces/steam';
import telegramController = require("./telegram");
import { PuppetApi } from '../api/puppet';
import { BotApi } from '../api/bot';
import { ICookie } from '../interfaces/puppet';
import BotRepository = require('../repositories/BotRepository');
import { IBotDocument } from '../repositories/interfaces/IBotDocument';
import BotSchema from '../repositories/schemas/BotSchema';

export class BotController {
  private _repository: BotRepository;

  constructor(repository: BotRepository) {
    this._repository = repository;
  }

  public async findByTypeId(typeId: EnumBot): Promise<IBotDocument[]> {
    return this._repository.findByType(typeId);
  }

  public findById(id: string): Promise<IBotDocument> {
    return this._repository.findOne(id);
  }

  public create(type: EnumBot, name: string): Promise<IBotDocument> {
    const entity = new BotSchema({ type, name, worker: false, cookie: "", code: "" })
    return this._repository.create(entity);
  }

  public async update(botId: string, worker: boolean, code: string): Promise<IBotDocument> {
    const bot = await this._repository.findOne(botId);
    await this.manageBot(bot, worker);
    bot.worker = worker;
    bot.code = code;
    return await this._repository.update(botId, bot);
  }

  public async remove(botId: string): Promise<IBotDocument> {
    const bot = await this.findById(botId);
    if (bot.worker) {
      throw new Error("Bot is working");
    }
    return await this._repository.delete(botId);
  }

  private async manageBot(bot: IBotDocument, willWork: boolean) {
    const workingNow = bot.worker;
    const start = !workingNow && willWork;
    const stop = workingNow && !willWork;
    if (start) {
      await this.startBot(bot._id);
      await this.sendBotMessage(bot, "Started");
    }
    if (stop) {
      await this.stopBot(bot._id);
      await this.sendBotMessage(bot, "Stopped");
    }
  }

  private sendBotMessage(bot: IBotDocument, state: string) {
    const botText = getBotText(bot.type);
    const message = `${botText} - ${bot._id}: ${state}`;
    return telegramController.sendMessage(message);
  }

  private async stopBot(botId: string) {
    const api = new BotApi();
    await api.stop(botId);
  }

  private async startBot(botId: string) {
    const api = new BotApi();
    await api.start(botId);
  }

  public async login(botId: string, steamLogin: ISteamLogin): Promise<IBotDocument> {
    const bot = await this._repository.findOne(botId);
    const cookie = await this.getCookie(bot.type, steamLogin);
    bot.cookie = cookie;
    return await this._repository.update(botId, bot);
  }

  private getCookie(site: EnumSite, steamLogin: ISteamLogin) {
    switch (site){
      case EnumSite.CsGoEmpire: return this.empireLoginCookie(steamLogin);
      case EnumSite.Rollbit: return this.rollbitLoginCookie(steamLogin);
      case EnumSite.Duelbits: return this.duelbitsLoginCookie(steamLogin);
    }
  }

  private async empireLoginCookie(steamLogin: ISteamLogin): Promise<string> {
    const api = new PuppetApi();
    const cookies = await api.empireLogin(steamLogin);
    const cookie = this.stringifyCookies(cookies);
    return cookie;
  }

  private async rollbitLoginCookie(steamLogin: ISteamLogin): Promise<string> {
    const api = new PuppetApi();
    const cookies = await api.rollbitLogin(steamLogin);
    const cookie = this.stringifyCookies(cookies);
    return cookie;
  }

  private stringifyCookies(cookies: ICookie[]): string {
    return cookies.map(c => `${c.name}=${c.value}`).join(';');
  }

  private async duelbitsLoginCookie(steamLogin: ISteamLogin): Promise<string> {
    const api = new PuppetApi();
    const response = await api.duelbitsLogin(steamLogin);
    return response.token;
  }
}