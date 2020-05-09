import paramController = require('../../controllers/botParam');
import { IWishlistItem } from '../../models/wishlistItem';
import { IBotParam } from '../../models/botParam';
import { WorkerTask } from '../Common/WorkerTask';
import { EnumBot } from '../../helpers/enum';
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
    var botParamPromise = this.getBotParam();
    var wishlistItemsPromise = this.getWishlistItems();
    var result = await Promise.all([botParamPromise, wishlistItemsPromise]);
    this.$botParam = result[0];
    this.$wishlistItems = result[1];
  }
}
