import { EnumBot } from '../../helpers/enum';
import { IEmpireDotaInventoryItem } from '../../interfaces/storeItem';
import { EmpireWithdrawMakerTask } from './EmpireWithdrawMakerTask';
export class EmpireDotaWithdrawMakerTask extends EmpireWithdrawMakerTask<IEmpireDotaInventoryItem> {
  bot = EnumBot.EmpireDota;
}
