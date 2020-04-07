const mongoose = require('mongoose');
var http = require("http");
const config = require('./config');
const workerHandlerController = require('./app/controllers/workerHandler');
const paramController = require('./app/controllers/param');
const telegram = require('./app/helpers/telegram');
const PORT = process.env.PORT || 3000

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
  var lines = ['/service: Handle service', '/waitPeriod: Wait period'];
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
bot.onText(/\/waitPeriod/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Refresh period [mS]?', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: '1 mS',
          callback_data: 'wait.1ms'
        },{
          text: '10 mS',
          callback_data: 'wait.10mS'
        },{
          text: '100 mS',
          callback_data: 'wait.100mS'
        }],[{
          text: '1 Second',
          callback_data: 'wait.1s'
        },{
          text: '2 Second',
          callback_data: 'wait.2s'
        }
      ]]
    }
  });
});

bot.on('callback_query', function onCallbackQuery(callbackQuery){
  // console.log(callbackQuery)
  const action = callbackQuery.data // This is responsible for checking the content of callback_data
  // const msg = callbackQuery.message

  switch (action) {
    case 'service.start':
      workerHandlerController.start();
      break;
    case 'service.stop':
      workerHandlerController.stop();
      break;
    case 'service.restart':
      workerHandlerController.restart();
      break;
    case 'wait.1ms':
      paramController.update(paramEnum.Period, 1);
      break;
    case 'wait.10mS':
      paramController.update(paramEnum.Period, 10);
      break;
    case 'wait.100mS':
      paramController.update(paramEnum.Period, 100);
      break;
    case 'wait.1s':
      paramController.update(paramEnum.Period, 1000);
      break;
    case 'wait.2s':
      paramController.update(paramEnum.Period, 2000);
      break;
    default:
      break;
  }
});

const paramEnum = {
  Period: 1,
  Code: 2,
  Cookie: 3
}