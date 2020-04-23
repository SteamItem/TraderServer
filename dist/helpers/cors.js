"use strict";
var config = require("../config");
function getCorsOptions() {
    var whitelistConfig = config.CORS_WHITELIST;
    var whitelist = whitelistConfig.split(",");
    var corsOptions = {
        origin: function (origin, callback) {
            if (origin && whitelist.indexOf(origin) !== -1) {
                callback(null, true);
            }
            else {
                console.log(origin);
                callback(new Error('Not allowed by CORS'));
            }
        }
    };
    return corsOptions;
}
module.exports = {
    getCorsOptions: getCorsOptions
};
