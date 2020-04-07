var pm2 = require('pm2');

exports.start = () => {
  pm2.connect(function(err) {
    if (err) throw err;
    pm2.start({
      script: './worker.js',
    }, function(err, apps) {
      pm2.disconnect();
      if (err) throw err;
    });
  });
}

exports.stop = () => {
  pm2.connect(function(err) {
    if (err) throw err;
    pm2.stop('worker', function(err, apps) {
      pm2.disconnect();
      if (err) throw err;
    });
  });
}

exports.restart = () => {
  pm2.connect(function(err) {
    if (err) throw err;
    pm2.restart('worker', function(err, apps) {
      pm2.disconnect();
    if (err) throw err;
    });
  });
}
