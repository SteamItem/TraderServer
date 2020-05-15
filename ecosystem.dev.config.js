module.exports = {
  apps : [{
    name: "server",
    script: "./dist/server.js",
    time: true,
    env: {
      NODE_ENV: "development",
      CORS_WHITELIST: "http://localhost:8080",
      DB_URL: "mongodb://admin:1234qwer@ds161148.mlab.com:61148/dota",
      TELEGRAM_TOKEN: "1271936615:AAH-ZQajPguxAMBp2j6vvLZfe0vN7xeoo1E",
      TELEGRAM_CHAT_ID: "-367623724"
    }
  }, {
    name: "instant",
    script: "./dist/instantWorker.js",
    time: true,
    env: {
      NODE_ENV: "development",
      DB_URL: "mongodb://admin:1234qwer@ds161148.mlab.com:61148/dota",
      TELEGRAM_TOKEN: "1271936615:AAH-ZQajPguxAMBp2j6vvLZfe0vN7xeoo1E",
      TELEGRAM_CHAT_ID: "-367623724"
    }
  }, {
    name: "dota",
    script: "./dist/dotaWorker.js",
    time: true,
    env: {
      NODE_ENV: "development",
      DB_URL: "mongodb://admin:1234qwer@ds161148.mlab.com:61148/dota",
      TELEGRAM_TOKEN: "1271936615:AAH-ZQajPguxAMBp2j6vvLZfe0vN7xeoo1E",
      TELEGRAM_CHAT_ID: "-367623724"
    }
  }, {
    name: "rollbit",
    script: "./dist/rollbitWorker.js",
    time: true,
    env: {
      NODE_ENV: "production",
      DB_URL: "mongodb://admin:1234qwer@ds159963.mlab.com:59963/csgobot-prod",
      TELEGRAM_TOKEN: "1271936615:AAH-ZQajPguxAMBp2j6vvLZfe0vN7xeoo1E",
      TELEGRAM_CHAT_ID: "-367623724"
    }
  }, {
    name: "rollbitLogger",
    script: "./dist/rollbitLogger.js",
    time: true,
    env: {
      NODE_ENV: "production",
      DB_URL: "mongodb://admin:1234qwer@ds159963.mlab.com:59963/csgobot-prod",
      TELEGRAM_TOKEN: "1271936615:AAH-ZQajPguxAMBp2j6vvLZfe0vN7xeoo1E",
      TELEGRAM_CHAT_ID: "-367623724"
    }
  }]
}