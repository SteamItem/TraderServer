const mongoose = require('mongoose');
var http = require("http");
const config = require('./config');
const workerHandler = require('./app/controllers/workerHandler');
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
bot.onText(/\/service/, (msg) => {
  bot.sendMessage(msg.chat.id,'What do you want to do with service?', {
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

bot.on('callback_query', function onCallbackQuery(callbackQuery){
  console.log(callbackQuery)
  const action = callbackQuery.data // This is responsible for checking the content of callback_data
  const msg = callbackQuery.message

  switch (action) {
    case 'service.start':
      workerHandler.start();
      break;
    case 'service.stop':
      workerHandler.stop();
      break;
    case 'service.restart':
      workerHandler.restart();
      break;
    default:
      break;
  }
});
