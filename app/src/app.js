var express = require('express');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var log4js = require('log4js');
var { expressjwt: jwt } = require('express-jwt');

require('./util/enhance');
var env = require('./config/env');
env.init();
var config = require('./config/config');
var router = require('./router');

var app = express();
var server = http.createServer(app);

app.use(log4js.connectLogger(log4js.getLogger(), { level: 'info' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../public')));
app.use(
  jwt({
    secret: config.secret,
    algorithms: ['HS256'],
    getToken: function fromHeaderOrQuerystring(req) {
      return req.cookies[config.token_name];
    },
  }).unless({ path: ['/api/login'] })
);
app.use('/api', router);

app.use(function (req, res, next) {
  res.status(404).send({
    code: 1,
    msg: '404 Not Found'
  });
});

app.use(function (err, req, res, next) {
  if (err.status === 401) {
    res.send({ code: -1 });
  } else {
    res.status(err.status || 500).send({
      code: 1,
      msg: '500 Internal Server Error'
    });
  }
});

process.on('unhandledRejection', (error, promise) => {
  console.error('unhandledRejection', error);
});

process.on('uncaughtException', (error, origin) => {
  console.error('uncaughtException', error);
});

module.exports = { app: app, server: server };