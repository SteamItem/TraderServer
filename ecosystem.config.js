module.exports = {
  apps : [{
    name: "Server",
    script: "./dist/server.js",
    time: true,
    env: {
      NODE_ENV: "development",
      CORS_WHITELIST: "http://localhost:8080",
      DB_URL: "mongodb://admin:1234qwer@ds161148.mlab.com:61148/dota",
      TELEGRAM_TOKEN: "1271936615:AAH-ZQajPguxAMBp2j6vvLZfe0vN7xeoo1E",
      TELEGRAM_CHAT_ID: "-367623724"
    },
    env_production: {
      NODE_ENV: "production",
      CORS_WHITELIST: "https://traderbot.netlify.app",
      DB_URL: "mongodb://admin:1234qwer@ds159963.mlab.com:59963/csgobot-prod",
      TELEGRAM_TOKEN: "1274822023:AAHdhNgE194hHQJRaqw-EIIf-fn4VB1ZN4E",
      TELEGRAM_CHAT_ID: "-479108586"
    }
  }, {
    name: "Worker",
    script: "./dist/worker.js",
    time: true,
    env: {
      NODE_ENV: "development",
      DB_URL: "mongodb://admin:1234qwer@ds161148.mlab.com:61148/dota",
      TELEGRAM_TOKEN: "1271936615:AAH-ZQajPguxAMBp2j6vvLZfe0vN7xeoo1E",
      TELEGRAM_CHAT_ID: "-367623724"
    },
    env_production: {
      NODE_ENV: "production",
      DB_URL: "mongodb://admin:1234qwer@ds159963.mlab.com:59963/csgobot-prod",
      TELEGRAM_TOKEN: "1274822023:AAHdhNgE194hHQJRaqw-EIIf-fn4VB1ZN4E",
      TELEGRAM_CHAT_ID: "-479108586"
    }
  }, {
    name: "Fetcher",
    script: "./dist/fetcher.js",
    time: true,
    env: {
      NODE_ENV: "development",
      DB_URL: "mongodb://admin:1234qwer@ds161148.mlab.com:61148/dota",
      WEB_URL: "http://localhost:3000/"
    },
    env_production: {
      NODE_ENV: "production",
      DB_URL: "mongodb://admin:1234qwer@ds159963.mlab.com:59963/csgobot-prod",
      WEB_URL: "https://csgo-trader-bot.herokuapp.com/"
    }
  }, {
    name: "Rollbit",
    script: "./dist/rollbit.js",
    time: true,
    env: {
      NODE_ENV: "development",
      DB_URL: "mongodb://admin:1234qwer@ds161148.mlab.com:61148/dota"
    },
    env_production: {
      NODE_ENV: "production",
      DB_URL: "mongodb://admin:1234qwer@ds159963.mlab.com:59963/csgobot-prod"
    }
  }]
}