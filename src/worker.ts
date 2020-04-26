import workerController = require('./controllers/worker');
import mongoHelper = require('./helpers/mongo');

mongoHelper.connect();

var worker = new workerController.Worker();
worker.work();