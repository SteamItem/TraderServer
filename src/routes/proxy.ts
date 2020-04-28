import cors = require('cors');
import express = require('express');
import mung = require('express-mung');
var cors_proxy = require('../lib/cors-anywhere');
import corsHelper = require('../helpers/cors');

module.exports = (app: express.Express) => {
  const corsOptions = corsHelper.getCorsOptions();

  let proxy = cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeaders: [], // Do not require any headers.
    removeHeaders: [] // Do not remove any headers.
  });

  app.use(mung.write(appendText)).get('/proxy/:proxyUrl*', cors(corsOptions), (req: express.Request, res: express.Response) => {
    req.url = req.url.replace('/proxy/', '/');
    proxy.emit('request', req, res);
    return res;
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

  function appendText (chunk: any, encoding: any, req: any, res: any) {
    var stringifiedResult = chunk.toString(encoding);
    console.log(stringifiedResult);
    return (stringifiedResult + ' with more content')
  }

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
}