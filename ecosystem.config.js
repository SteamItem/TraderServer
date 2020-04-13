module.exports = {
  apps : [{
    name: "Server",
    script: "./dist/server.js",
    time: true,
    env: {
      NODE_ENV: "development",
      DB_URL: "mongodb://admin:1234qwer@ds161148.mlab.com:61148/dota",
      TELEGRAM_TOKEN: "1271936615:AAH-ZQajPguxAMBp2j6vvLZfe0vN7xeoo1E",
      TELEGRAM_CHAT_ID: "-367623724"
    },
    env_production: {
      NODE_ENV: "production",
      DB_URL: "mongodb://admin:1234qwer@ds161148.mlab.com:61148/dota",
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
      DB_URL: "mongodb://admin:1234qwer@ds161148.mlab.com:61148/dota",
      TELEGRAM_TOKEN: "1274822023:AAHdhNgE194hHQJRaqw-EIIf-fn4VB1ZN4E",
      TELEGRAM_CHAT_ID: "-479108586"
    }
  }]
}