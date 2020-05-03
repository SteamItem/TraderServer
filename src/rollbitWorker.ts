import mongoHelper = require('./helpers/mongo');
import { RollbitCsGoWorker } from "./workers/Worker/RollbitCsGoWorker";

mongoHelper.connect();

var worker = new RollbitCsGoWorker();
worker.schedule();
