import cors = require('cors');
import config = require('../config');

function getCorsOptions() {
  const whitelistConfig = config.CORS_WHITELIST;
  const whitelist = whitelistConfig.split(",");
  const corsOptions: cors.CorsOptions = {
    origin: function (origin, callback) {
      if (origin && whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        console.log(origin);
        callback(new Error('Not allowed by CORS'))
      }
    }
  }
  return corsOptions;
}

export = {
  getCorsOptions
}