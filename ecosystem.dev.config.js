module.exports = {
  apps : [{
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