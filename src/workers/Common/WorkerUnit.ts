import { EnumSite, EnumBot } from '../../helpers/enum';
export abstract class WorkerUnit {
  abstract site: EnumSite;
  abstract bot: EnumBot;
}
