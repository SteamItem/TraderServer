var pm2 = require('pm2');
const telegram = require('../helpers/telegram');

exports.start = () => {
  pm2.connect(function(err) {
    if (err) {
      return telegram.sendMessage("Failed to start: " + err.message);
    }
    pm2.start({
      script: '../../worker.js',
    }, function(err, apps) {
      pm2.disconnect();
      if (err) throw err
    });
    telegram.sendMessage("Started");
  });
}

exports.stop = () => {
  pm2.connect(function(err) {
    if (err) {
      return telegram.sendMessage("Failed to stop: " + err.message);
    }
    pm2.stop('worker', function(err, apps) {
      pm2.disconnect();
      if (err) throw err
    });
    telegram.sendMessage("Stopped");
  });
}

exports.restart = () => {
  pm2.connect(function(err) {
    if (err) {
      return telegram.sendMessage("Failed to restart: " + err.message);
    }
    pm2.restart('worker', function(err, apps) {
      pm2.disconnect();
      if (err) throw err
    });
    telegram.sendMessage("Restarted");
  });
}
