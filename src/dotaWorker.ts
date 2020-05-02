import mongoHelper = require('./helpers/mongo');
import { ConsoleLogger } from "./workers/Logger/ConsoleLogger";
import { EmpireDotaWorker } from "./workers/Worker/EmpireDotaWorker";

mongoHelper.connect();

var logger = new ConsoleLogger();
var worker = new EmpireDotaWorker(logger);
worker.work();