import mongoHelper = require('./helpers/mongo');
import { siteText, botText, EnumSite, EnumBot } from './helpers/enum';
import { ConsoleLogger } from "./workers/Logger/ConsoleLogger";
import { EmpireDotaWorker } from "./workers/Worker/EmpireDotaWorker";

mongoHelper.connect();

var siteName = siteText(EnumSite.CsGoEmpire)
var botName = botText(EnumBot.EmpireDota);
var logger = new ConsoleLogger(siteName, botName);
var worker = new EmpireDotaWorker(logger);
worker.work();