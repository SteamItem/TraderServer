"use strict";
module.exports = {
    CORS_WHITELIST: process.env.CORS_WHITELIST || "INVALID WHITELIST",
    DB_URL: process.env.DB_URL || "INVALID DB URL",
    TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN || "INVALID TOKEN",
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || "INVALID CHAT ID",
    WEB_URL: process.env.WEB_URL || "INVALID WEB URL"
};
