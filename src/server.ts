import mongoose = require('mongoose');
import http = require("http");
import config = require('./config');
import paramController = require('./controllers/param');
import wishlistItemController = require('./controllers/wishlistItem');
import csgoController = require('./controllers/csgo');
import logController = require('./controllers/log');
import withdrawController = require('./controllers/withdraw');
import telegram = require('./helpers/telegram');
const PORT = process.env.PORT || 3000;

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(config.DB_URL, {
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
  var lines = ['/service: Manage service', '/period: Wait period', '/profile: Profile operations', '/wishlist: Wishlist manager', '/pinUpdate [PIN]: Update pin code', '/log: Read logs'];
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
          text: 'Status',
          callback_data: 'service.status'
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
bot.onText(/\/pinUpdate (.+)/, async (msg, match) => {
  if (!match) {
    bot.sendMessage(msg.chat.id, 'Please provide a pin');
    return;
  }
  var newPin = match[1];
  await paramController.updateCode(newPin);
  bot.sendMessage(msg.chat.id, `New pin code: ${newPin}`);
});
bot.onText(/\/profile/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Profile operations', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Steam Name',
          callback_data: 'profile.steamName'
        }],[{
          text: 'Balance',
          callback_data: 'profile.balance'
        }],[{
          text: 'Pin',
          callback_data: 'profile.pin'
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
bot.onText(/\/log/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Get logs', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'All',
          callback_data: 'log.all'
        }, {
          text: 'Withdraw',
          callback_data: 'log.withdraw'
        }
      ]]
    }
  });
});

bot.on('callback_query', async function onCallbackQuery(callbackQuery) {
  if (!callbackQuery) return;
  const action = callbackQuery.data;
  if (!callbackQuery.message) return;
  const chatId = callbackQuery.message.chat.id;
  if (!action) return;
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
    case 'log':
      onLogCallbackQuery(chatId, subAction);
      break;
    default:
      throw new Error('Unknown main action');
 }
});

async function onServiceCallbackQuery(chatId: number, subAction: string) {
  switch (subAction) {
    case 'start':
      await paramController.startWorker();
      bot.sendMessage(chatId, 'Worker Started');
      break;
    case 'stop':
      await paramController.stopWorker();
      bot.sendMessage(chatId, "Worker Stopped");
      break;
    case 'status':
      var status = await paramController.getWorkerStatus();
      var message: string;
      if (status && status.value === true) {
        message = "It is working";
      } else {
        message = "Not working";
      }
      bot.sendMessage(chatId, message);
      break;
    default:
      throw new Error('Unknown sub action');
  }
}

async function onPeriodCallbackQuery(chatId: number, subAction: string) {
  switch (subAction) {
    case '1ms':
      await paramController.updatePeriod(1);
      bot.sendMessage(chatId, 'Updated to 1 mS');
      break;
    case '10mS':
      await paramController.updatePeriod(10);
      bot.sendMessage(chatId, 'Updated to 10 mS');
      break;
    case '100mS':
      await paramController.updatePeriod(100);
      bot.sendMessage(chatId, 'Updated to 100 mS');
      break;
    case '1s':
      await paramController.updatePeriod(1000);
      bot.sendMessage(chatId, 'Updated to 1 Second');
      break;
    case '2s':
      await paramController.updatePeriod(2000);
      bot.sendMessage(chatId, 'Updated to 2 Seconds');
      break;
    default:
      throw new Error('Unknown sub action');
  }
}

async function onProfileCallbackQuery(chatId: number, subAction: string) {
  switch (subAction) {
    case 'steamName':
      var profile = await csgoController.profile();
      bot.sendMessage(chatId, `Steam Name: ${profile.steam_name}`);
      break;
    case 'balance':
      var profile = await csgoController.profile();
      bot.sendMessage(chatId, `Balance: ${profile.balance / 100}$`);
      break;
    case 'pin':
      var pinParam = await paramController.getCode();
      if (!pinParam) {
        bot.sendMessage(chatId, 'Pin not found');
        return;
      }
      bot.sendMessage(chatId, `Pin code: ${pinParam.value}`);
      break;
    default:
      throw new Error('Unknown sub action');
  }
}

async function onWishlistCallbackQuery(chatId: number, subAction: string) {
  switch (subAction) {
    case 'list':
      var wishlistItems = await wishlistItemController.findAll();
      var texts = wishlistItems.map(wi => {
        return `${wi.name}: ${wi.max_price / 100}$`;
      });
      var text = texts.join('\n');
      bot.sendMessage(chatId, text);
      break;
    default:
      throw new Error('Unknown sub action');
  }
}

async function onLogCallbackQuery(chatId: number, subAction: string) {
  switch (subAction) {
    case 'all':
      var logs = await logController.findLastTen();
      var texts = ['Last 10 logs:'];
      logs.forEach(l => {
        texts.push(`${l.created_at}: ${l.message}`);
      });
      var text = texts.join('\n');
      bot.sendMessage(chatId, text);
      break;
    case 'withdraw':
      var withdraws = await withdrawController.findLastTen();
      var texts = ['Last 10 withdraws:'];
      withdraws.forEach(wd => {
        texts.push(`${wd.created_at}: ${wd.market_name} bought for ${wd.market_value / 100}$ which is below ${wd.max_price / 100}$`);
      });
      var text = texts.join('\n');
      bot.sendMessage(chatId, text);
      break;
    default:
      throw new Error('Unknown sub action');
  }
}