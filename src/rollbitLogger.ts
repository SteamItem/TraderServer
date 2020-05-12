import { RollbitSocket } from './controllers/api/rollbitSocket';

var socket = new RollbitSocket();
socket.connect();

setInterval(function () {
  socket.send('sync', '', true);
}, 2500)
