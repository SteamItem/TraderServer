import fetcherController = require('./controllers/fetcher');
import mongoHelper = require('./helpers/mongo');

mongoHelper.connect();

var fetcher = new fetcherController.Fetcher();
fetcher.fetch();