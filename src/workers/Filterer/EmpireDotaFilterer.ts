import { EnumBot } from '../../helpers/enum';
import { IEmpireDotaInventoryItem } from '../../interfaces/storeItem';
import { EmpireFilterer } from './EmpireFilterer';
export class EmpireDotaFilterer extends EmpireFilterer<IEmpireDotaInventoryItem> {
  bot = EnumBot.EmpireDota;
}
