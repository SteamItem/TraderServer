import mongoHelper = require('./helpers/mongo');
import { ConsoleLogger } from "./workers/Logger";
import { EmpireInstantWorker } from "./workers/Worker";

mongoHelper.connect();

var logger = new ConsoleLogger();
var worker = new EmpireInstantWorker(logger);
worker.work();