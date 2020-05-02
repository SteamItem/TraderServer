import mongoHelper = require('./helpers/mongo');
import { siteText, botText, EnumSite, EnumBot } from './helpers/enum';
import { ConsoleLogger } from "./workers/Logger/ConsoleLogger";
import { EmpireInstantWorker } from "./workers/Worker/EmpireInstantWorker";

mongoHelper.connect();

var siteName = siteText(EnumSite.CsGoEmpire)
var botName = botText(EnumBot.EmpireInstant);
var logger = new ConsoleLogger(siteName, botName);
var worker = new EmpireInstantWorker(logger);
worker.work();