import mongoHelper = require('./helpers/mongo');
import { siteText, botText, EnumSite, EnumBot } from './helpers/enum';
import { ConsoleLogger } from "./workers/Logger/ConsoleLogger";
import { RollbitCsGoWorker } from "./workers/Worker/RollbitCsGoWorker";

mongoHelper.connect();

var siteName = siteText(EnumSite.Rollbit)
var botName = botText(EnumBot.RollbitCsGo);
var logger = new ConsoleLogger(siteName, botName);
var worker = new RollbitCsGoWorker(logger);
worker.work();
