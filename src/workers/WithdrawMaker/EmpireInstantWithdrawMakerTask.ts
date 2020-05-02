import { EnumBot } from '../../helpers/enum';
import { IEmpireInstantInventoryItem } from '../../interfaces/storeItem';
import { EmpireWithdrawMakerTask } from './EmpireWithdrawMakerTask';
export class EmpireInstantWithdrawMakerTask extends EmpireWithdrawMakerTask<IEmpireInstantInventoryItem> {
  bot = EnumBot.EmpireInstant;
}
