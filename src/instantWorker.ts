import mongoHelper = require('./helpers/mongo');
import { ConsoleLogger } from "./workers/Logger/ConsoleLogger";
import { EmpireInstantWorker } from "./workers/Worker/EmpireInstantWorker";

mongoHelper.connect();

var logger = new ConsoleLogger();
var worker = new EmpireInstantWorker(logger);
worker.work();