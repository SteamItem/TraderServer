"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fetcherController = require("./controllers/fetcher");
var mongoHelper = require("./helpers/mongo");
mongoHelper.connect();
var fetcher = new fetcherController.Fetcher();
fetcher.fetch();
