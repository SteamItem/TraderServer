import { EnumSite, EnumBot } from '../../helpers/enum';
export abstract class WorkerUnit {
  abstract get site(): EnumSite;
  abstract get bot(): EnumBot;
  abstract get workerJobName(): string;
}
