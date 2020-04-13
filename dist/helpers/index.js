"use strict";
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
module.exports = {
    sleep: sleep
};
