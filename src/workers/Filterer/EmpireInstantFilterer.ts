import { EnumBot } from '../../helpers/enum';
import { IEmpireInstantInventoryItem } from '../../interfaces/storeItem';
import { EmpireFilterer } from './EmpireFilterer';
export class EmpireInstantFilterer extends EmpireFilterer<IEmpireInstantInventoryItem> {
  bot = EnumBot.EmpireInstant;
}
