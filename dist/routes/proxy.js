"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cors = require("cors");
var cors_proxy = require('cors-anywhere');
var corsHelper = require("../helpers/cors");
module.exports = function (app) {
    var corsOptions = corsHelper.getCorsOptions();
    var proxy = cors_proxy.createServer({
        originWhitelist: [],
        requireHeaders: [],
        removeHeaders: [] // Do not remove any headers.
    });
    app.get('/proxy/:proxyUrl*', cors(corsOptions), function (req, res) {
        req.url = req.url.replace('/proxy/', '/');
        proxy.emit('request', req, res);
        // responseInterceptor(req, res);
        // var send = res.send;
        // var body = res.send instanceof Buffer ? res.send.toString() : res.send;
        // console.log(JSON.stringify(body));
        // res.send = function (string) {
        //   var body = string instanceof Buffer ? string.toString() : string;
        //   body = body.replace(/<\/body>/, function (w) {
        //     return 'foo' + w;
        //   });
        //   send.call(this, body);
        // });
        // console.log("req: " + JSON.stringify(req));
        // console.log("res: " + JSON.stringify(res));
    });
    // function responseInterceptor(_req: any, res: any) {
    //   var originalSend = res.send;
    //   res.send = function(){
    //     console.log(arguments[0]);
    //     // arguments[0] = convertData(arguments[0]);
    //     originalSend.apply(res, arguments);
    //   };
    // }
    // this.use(function (req, res, next) {
    //   var send = res.send;
    //   res.send = function (string) {
    //     var body = string instanceof Buffer ? string.toString() : string;
    //     body = body.replace(/<\/body>/, function (w) {
    //       return 'foo' + w;
    //     });
    //     send.call(this, body);
    //   });
    //   next();
    // };
};
