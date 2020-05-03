import mongoHelper = require('./helpers/mongo');
import { EmpireDotaWorker } from "./workers/Worker/EmpireDotaWorker";

mongoHelper.connect();

var worker = new EmpireDotaWorker();
worker.schedule();