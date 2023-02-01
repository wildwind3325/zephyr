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
var baseService = require('./service/base');

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
      return req.cookies[config.cookie_name];
    },
  }).unless({ path: ['/api/anonymous'] })
);
app.use('/api', router);

app.use(function (req, res, next) {
  res.status(404).send({
    code: 1,
    msg: 'system.msg.notFound'
  });
});

app.use(async function (err, req, res, next) {
  if (err.status === 401) {
    res.status(200);
    let flag = await baseService.getConfig('login.feishu.enable');
    if (flag === '1') {
      let app_id = await baseService.getConfig('login.feishu.app_id');
      res.send({
        code: -1,
        data: {
          loggedIn: false,
          app_id: app_id
        }
      });
    } else {
      res.send({
        code: -1,
        data: { loggedIn: false }
      });
    }
  } else {
    res.status(err.status || 500).send({
      code: 1,
      msg: 'system.msg.exception'
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