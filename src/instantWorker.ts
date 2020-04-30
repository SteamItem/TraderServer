import workerController = require('./controllers/worker');
import mongoHelper = require('./helpers/mongo');

mongoHelper.connect();

var worker = workerController.instantWorker();
worker.work();