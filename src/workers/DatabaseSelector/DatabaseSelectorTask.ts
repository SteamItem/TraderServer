import botUserController = require('../../controllers/botUser');
import { IWishlistItem } from '../../models/wishlistItem';
import { IBotUser } from '../../models/botUser';
import { WorkerTask } from '../Common/WorkerTask';
import { EnumBot } from '../../helpers/enum';
import config = require('../../config');
export abstract class DatabaseSelectorTask extends WorkerTask {
  taskName = "Database Selector";
  constructor(bot: EnumBot) {
    super();
    this.bot = bot;
  }
  private bot: EnumBot;
  private getBotUser() {
    return botUserController.findOne(config.BOTUSER_ID);
  }
  private $botUser: IBotUser;
  public get botUser(): IBotUser {
    return this.$botUser;
  }
  private $wishlistItems: IWishlistItem[];
  public get wishlistItems(): IWishlistItem[] {
    return this.$wishlistItems;
  }
  abstract getWishlistItems(): Promise<IWishlistItem[]>;
  async work(): Promise<void> {
    const botUserPromise = this.getBotUser();
    const wishlistItemsPromise = this.getWishlistItems();
    const result = await Promise.all([botUserPromise, wishlistItemsPromise]);
    this.$botUser = result[0];
    this.$wishlistItems = result[1];
  }
}
