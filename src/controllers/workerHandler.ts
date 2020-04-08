import pm2 = require('pm2');

function start() {
  pm2.connect(function(err) {
    if (err) throw err;
    pm2.start({
      script: './dist/worker.js',
    }, function(err, apps) {
      pm2.disconnect();
      if (err) throw err;
    });
  });
}

function stop() {
  pm2.connect(function(err) {
    if (err) throw err;
    pm2.stop('worker', function(err, apps) {
      pm2.disconnect();
      if (err) throw err;
    });
  });
}

function restart() {
  pm2.connect(function(err) {
    if (err) throw err;
    pm2.restart('worker', function(err, apps) {
      pm2.disconnect();
    if (err) throw err;
    });
  });
}

export = {
  start,
  stop,
  restart
}