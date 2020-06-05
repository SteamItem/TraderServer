import paramController = require('../../controllers/botParam');
import { WorkerTask } from '../Common/WorkerTask';
import { EnumBot } from '../../helpers/enum';
import { IBotParam, IWishlistItem } from '../../interfaces/common';
export abstract class DatabaseSelectorTask extends WorkerTask {
  taskName = "Database Selector";
  constructor(bot: EnumBot) {
    super();
    this.bot = bot;
  }
  private bot: EnumBot;
  private getBotParam() {
    return paramController.findOne(this.bot);
  }
  private $botParam: IBotParam;
  public get botParam(): IBotParam {
    return this.$botParam;
  }
  private $wishlistItems: IWishlistItem[];
  public get wishlistItems(): IWishlistItem[] {
    return this.$wishlistItems;
  }
  abstract getWishlistItems(): Promise<IWishlistItem[]>;
  async work() {
    const botParamPromise = this.getBotParam();
    const wishlistItemsPromise = this.getWishlistItems();
    const result = await Promise.all([botParamPromise, wishlistItemsPromise]);
    this.$botParam = result[0];
    this.$wishlistItems = result[1];
  }
}
