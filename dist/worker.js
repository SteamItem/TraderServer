"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var workerController = require("./controllers/worker");
var mongoHelper = require("./helpers/mongo");
mongoHelper.connect();
var worker = new workerController.Worker();
worker.work();
