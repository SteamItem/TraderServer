"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rollbitController = require("./controllers/rollbit");
var mongoHelper = require("./helpers/mongo");
mongoHelper.connect();
var logger = new rollbitController.RollbitLogger();
logger.startLogging();
