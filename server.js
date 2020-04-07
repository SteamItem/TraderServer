const mongoose = require('mongoose');
var http = require("http");
const config = require('./config');
const workerHandlerController = require('./app/controllers/workerHandler');
const paramController = require('./app/controllers/param');
const wishlistItemController = require('./app/controllers/wishlistItem');
const csgoController = require('./app/controllers/csgo');
const telegram = require('./app/helpers/telegram');
const { paramEnum } = require('./app/helpers/common');
const PORT = process.env.PORT || 3000;

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(config.dbUrl, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

http.createServer(function (request, response) {
   response.writeHead(200, {'Content-Type': 'text/plain'});
   // Send the response body as "Hello World"
   response.end('Hello World\n');
}).listen(PORT);

// Console will print the message
console.log(`Server is listening on port ${PORT}`);

var bot = telegram.getBot();
bot.onText(/\/help/, (msg) => {
  var lines = ['/service: Handle service', '/period: Wait period', '/profile: Profile Operations', '/wishlist: Manage your wishlist'];
  var message = lines.join('\n');
  bot.sendMessage(msg.chat.id, message);
});
bot.onText(/\/service/, (msg) => {
  bot.sendMessage(msg.chat.id, 'What do you want to do with service?', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Start',
          callback_data: 'service.start'
        },{
          text: 'Stop',
          callback_data: 'service.stop'
        },{
          text: 'Restart',
          callback_data: 'service.restart'
        }
      ]]
    }
  });
});
bot.onText(/\/period/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Wait time between iterations?', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: '1 mS',
          callback_data: 'period.1ms'
        },{
          text: '10 mS',
          callback_data: 'period.10mS'
        },{
          text: '100 mS',
          callback_data: 'period.100mS'
        }],[{
          text: '1 Second',
          callback_data: 'period.1s'
        },{
          text: '2 Seconds',
          callback_data: 'period.2s'
        }
      ]]
    }
  });
});
bot.onText(/\/profile/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Profile operations?', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Steam Name',
          callback_data: 'profile.steamName'
        }],[{
          text: 'Balance',
          callback_data: 'profile.balance'
        }
      ]]
    }
  });
});
bot.onText(/\/wishlist/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Wishlist Manager', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'List',
          callback_data: 'wishlist.list'
        }
      ]]
    }
  });
});

bot.on('callback_query', async function onCallbackQuery(callbackQuery){
  const action = callbackQuery.data // This is responsible for checking the content of callback_data

  var splittedActions = action.split('.');
  if (splittedActions.length !== 2) throw new Error("Unknown action");
  var mainAction = splittedActions[0];
  var subAction = splittedActions[1];

  switch (mainAction) {
    case 'service':
      onServiceCallbackQuery(subAction);
      break;
    case 'period':
      onPeriodCallbackQuery(subAction);
      break;
    case 'profile':
      onProfileCallbackQuery(subAction);
      break;
    case 'wishlist':
      onWishlistCallbackQuery(subAction);
      break;
    default:
      throw new Error('Unknown main action');
 }
});

async function onServiceCallbackQuery(subAction) {
  switch (subAction) {
    case 'start':
      workerHandlerController.start();
      break;
    case 'stop':
      workerHandlerController.stop();
      break;
    case 'restart':
      workerHandlerController.restart();
      break;
    default:
      throw new Error('Unknown sub action');
  }
}

async function onPeriodCallbackQuery(subAction) {
  switch (subAction) {
    case '1ms':
      paramController.update(paramEnum.Period, 1);
      break;
    case '10mS':
      paramController.update(paramEnum.Period, 10);
      break;
    case '100mS':
      paramController.update(paramEnum.Period, 100);
      break;
    case '1s':
      paramController.update(paramEnum.Period, 1000);
      break;
    case '2s':
      paramController.update(paramEnum.Period, 2000);
      break;
    default:
      throw new Error('Unknown sub action');
  }
}

async function onProfileCallbackQuery(subAction) {
  var profile = await csgoController.profile();
  switch (subAction) {
    case 'steamName':
      telegram.sendMessage(profile.steam_name);
      break;
    case 'balance':
      telegram.sendMessage(profile.balance);
      break;
    default:
      throw new Error('Unknown sub action');
  }
}

async function onWishlistCallbackQuery(subAction) {
  switch (subAction) {
    case 'list':
      wishlistItemController.findAll();
      break;
    default:
      throw new Error('Unknown sub action');
  }
}