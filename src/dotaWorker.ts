import mongoHelper = require('./helpers/mongo');
import { ConsoleLogger } from "./workers/Logger";
import { EmpireDotaWorker } from "./workers/Worker";

mongoHelper.connect();

var logger = new ConsoleLogger();
var worker = new EmpireDotaWorker(logger);
worker.work();