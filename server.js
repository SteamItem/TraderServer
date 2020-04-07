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
  var lines = ['/service: Manage service', '/period: Wait period', '/profile: Profile operations', '/wishlist: Wishlist manager'];
  var message = lines.join('\n');
  bot.sendMessage(msg.chat.id, message);
});
bot.onText(/\/service/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Manage service', {
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
  bot.sendMessage(msg.chat.id, 'Wait time between iterations', {
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
  bot.sendMessage(msg.chat.id, 'Profile operations', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Steam Name',
          callback_data: 'profile.steamName'
        },{
          text: 'Balance',
          callback_data: 'profile.balance'
        }
      ]]
    }
  });
});
bot.onText(/\/wishlist/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Wishlist manager', {
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
  const chatId = callbackQuery.message.chat.id;

  var splittedActions = action.split('.');
  if (splittedActions.length !== 2) throw new Error("Unknown action");
  var mainAction = splittedActions[0];
  var subAction = splittedActions[1];

  switch (mainAction) {
    case 'service':
      onServiceCallbackQuery(chatId, subAction);
      break;
    case 'period':
      onPeriodCallbackQuery(chatId, subAction);
      break;
    case 'profile':
      onProfileCallbackQuery(chatId, subAction);
      break;
    case 'wishlist':
      onWishlistCallbackQuery(chatId, subAction);
      break;
    default:
      throw new Error('Unknown main action');
 }
});

async function onServiceCallbackQuery(chatId, subAction) {
  switch (subAction) {
    case 'start':
      try {
        workerHandlerController.start();
        bot.sendMessage(chatId, "Started");
      } catch (e) {
        bot.sendMessage(chatId, e.message);
      }
      break;
    case 'stop':
      try {
        workerHandlerController.stop();
        bot.sendMessage(chatId, "Stopped");
      } catch (e) {
        bot.sendMessage(chatId, e.message);
      }
      break;
    case 'restart':
      try {
        workerHandlerController.restart();
        bot.sendMessage(chatId, "Restarted");
      } catch (e) {
        bot.sendMessage(chatId, e.message);
      }
      break;
    default:
      throw new Error('Unknown sub action');
  }
}

async function onPeriodCallbackQuery(chatId, subAction) {
  switch (subAction) {
    case '1ms':
      await paramController.update(paramEnum.Period, 1);
      bot.sendMessage(chatId, 'Updated to 1 mS');
      break;
    case '10mS':
      await paramController.update(paramEnum.Period, 10);
      bot.sendMessage(chatId, 'Updated to 10 mS');
      break;
    case '100mS':
      await paramController.update(paramEnum.Period, 100);
      bot.sendMessage(chatId, 'Updated to 100 mS');
      break;
    case '1s':
      await paramController.update(paramEnum.Period, 1000);
      bot.sendMessage(chatId, 'Updated to 1 Second');
      break;
    case '2s':
      await paramController.update(paramEnum.Period, 2000);
      bot.sendMessage(chatId, 'Updated to 2 Seconds');
      break;
    default:
      throw new Error('Unknown sub action');
  }
}

async function onProfileCallbackQuery(chatId, subAction) {
  var profile = await csgoController.profile();
  switch (subAction) {
    case 'steamName':
      bot.sendMessage(chatId, `Steam Name: ${profile.steam_name}`);
      break;
    case 'balance':
      bot.sendMessage(chatId, `Balance: ${profile.balance}`);
      break;
    default:
      throw new Error('Unknown sub action');
  }
}

async function onWishlistCallbackQuery(chatId, subAction) {
  switch (subAction) {
    case 'list':
      var wishlistItems = await wishlistItemController.findAll();
      bot.sendMessage(chatId, JSON.stringify(wishlistItems));
      break;
    default:
      throw new Error('Unknown sub action');
  }
}