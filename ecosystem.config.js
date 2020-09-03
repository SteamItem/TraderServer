module.exports = {
  apps : [{
    name: "server",
    script: "./dist/src/server.js",
    time: true,
    env: {
      NODE_ENV: "production",
      CORS_WHITELIST: "https://traderbot.netlify.app",
      DB_URL: "mongodb+srv://admin:1234qwer@mlab.cifvs.mongodb.net/csgobot-prod?retryWrites=true&w=majority",
      RDB_URL: "postgres://admin:1234qwer@srv-captain--trader-pg-db:5432/Trader?sslmode=disable",
      PUPPET_API: "http://srv-captain--puppet",
      TELEGRAM_TOKEN: "1274822023:AAHdhNgE194hHQJRaqw-EIIf-fn4VB1ZN4E",
      TELEGRAM_CHAT_ID: "-479108586"
    }
  }, {
    name: "rollbitWorker",
    script: "./dist/src/rollbitWorker.js",
    time: true,
    env: {
      NODE_ENV: "production",
      DB_URL: "mongodb+srv://admin:1234qwer@mlab.cifvs.mongodb.net/csgobot-prod?retryWrites=true&w=majority",
      TELEGRAM_TOKEN: "1274822023:AAHdhNgE194hHQJRaqw-EIIf-fn4VB1ZN4E",
      TELEGRAM_CHAT_ID: "-479108586"
    }
  }]
}