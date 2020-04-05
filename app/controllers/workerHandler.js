var pm2 = require('pm2');

exports.start = (req, res) => {
  pm2.connect(function(err) {
    if (err) {
      return res.status(404).send({
        message: "Failed to start: " + err.message
      });
    }
    pm2.start({
      script: '../../worker.js',
    }, function(err, apps) {
      pm2.disconnect();
      if (err) throw err
    });
    res.send({message: "Started successfully!"});
  });
}

exports.stop = (req, res) => {
  pm2.connect(function(err) {
    if (err) {
      return res.status(404).send({
        message: "Failed to stop: " + err.message
      });
    }
    pm2.stop('worker', function(err, apps) {
      pm2.disconnect();
      if (err) throw err
    });
    res.send({message: "Stopped successfully!"});
  });
}

exports.restart = (req, res) => {
  pm2.connect(function(err) {
    if (err) {
      return res.status(404).send({
        message: "Failed to restart: " + err.message
      });
    }
    pm2.restart('worker', function(err, apps) {
      pm2.disconnect();
      if (err) throw err
    });
    res.send({message: "Restarted successfully!"});
  });
}
