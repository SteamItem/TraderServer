module.exports = {
  apps : [{
    name: "server",
    script: "./dist/server.js",
    time: true,
    env: {
      NODE_ENV: "production",
      CORS_WHITELIST: "https://traderbot.netlify.app",
      PUPPET_API: "http://srv-captain--puppet",
      DATA_API: "http://srv-captain--data",
      TELEGRAM_TOKEN: "1274822023:AAHdhNgE194hHQJRaqw-EIIf-fn4VB1ZN4E",
      TELEGRAM_CHAT_ID: "-479108586"
    }
  }]
}