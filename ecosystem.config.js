module.exports = {
  apps : [{
    name: "Server",
    script: "./dist/server.js",
    time: true,
    env: {
      NODE_ENV: "production",
      CORS_WHITELIST: "https://traderbot.netlify.app",
      DB_URL: "mongodb://admin:1234qwer@ds159963.mlab.com:59963/csgobot-prod",
      TELEGRAM_TOKEN: "1274822023:AAHdhNgE194hHQJRaqw-EIIf-fn4VB1ZN4E",
      TELEGRAM_CHAT_ID: "-479108586"
    }
  }, {
    name: "dota",
    script: "./dist/dotaWorker.js",
    time: true,
    env: {
      NODE_ENV: "production",
      DB_URL: "mongodb://admin:1234qwer@ds159963.mlab.com:59963/csgobot-prod",
      TELEGRAM_TOKEN: "1274822023:AAHdhNgE194hHQJRaqw-EIIf-fn4VB1ZN4E",
      TELEGRAM_CHAT_ID: "-479108586"
    }
  }]
}