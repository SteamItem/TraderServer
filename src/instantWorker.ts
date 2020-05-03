import mongoHelper = require('./helpers/mongo');
import { EmpireInstantWorker } from "./workers/Worker/EmpireInstantWorker";

mongoHelper.connect();

var worker = new EmpireInstantWorker();
worker.schedule();