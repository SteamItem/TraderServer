// Configuring the database
const config = require('./config');
const mongoose = require('mongoose');
var http = require("http");
const workerController = require('./app/controllers/worker.js');
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
}).listen(3001);

// Console will print the message
console.log('Server is listening on port 3001');

workerController.withdraw();