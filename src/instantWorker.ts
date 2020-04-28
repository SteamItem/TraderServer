import workerController = require('./controllers/worker');
import mongoHelper = require('./helpers/mongo');

mongoHelper.connect();

var worker = new workerController.CsGoInstantWorker();
worker.work();