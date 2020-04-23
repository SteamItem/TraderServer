"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function (app) {
    app.get('/', function (_req, res) {
        res.send("Hello World");
    });
};
