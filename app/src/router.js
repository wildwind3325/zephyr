var express = require('express');
var log4js = require('log4js');
var multer = require('multer');
var jwt = require('jsonwebtoken');

var baseService = require('./service/base');
var feishuService = require('./service/feishu');
var config = require('./config/config');

var router = express.Router();
var logger = log4js.getLogger();

router.post('/login', async function (req, res, next) {
  try {
    switch (req.query.action) {
      case 'login':
        if (!feishuService.app_id) {
          let app_id = config.app_id;
          let app_secret = config.app_secret;
          await feishuService.setup(app_id, app_secret);
        }
        let result = await feishuService.login(req.body.code);
        if (result.code !== 0) {
          res.send({
            code: 1,
            msg: '飞书认证失败'
          });
        } else {
          let user = {
            user_id: result.data.user_id,
            name: result.data.name,
            email: result.data.email
          };
          let token = jwt.sign(user, config.secret, { expiresIn: '7d' });
          res.cookie(config.token_name, token, {
            maxAge: 1000 * 3600 * 24 * 7,
            httpOnly: true
          });
          res.send({ code: 0 });
        }
        break;
      case 'logout':
        res.clearCookie(config.token_name);
        res.send({ code: 0 });
        break;
      default:
        if (req.auth) {
          res.send({
            code: 0,
            data: { loggedIn: true }
          });
        } else {
          res.send({
            code: 0,
            data: {
              loggedIn: false,
              app_id: config.app_id
            }
          });
        }
        break;
    }
  } catch (err) {
    logger.error(err.message, err);
    res.send({
      code: 1,
      msg: '处理请求时发生异常'
    });
  }
});

router.post('/common', async function (req, res, next) {
  try {
    let result = baseService.preProcess(req);
    if (result.code !== 0) {
      res.send(result);
    } else {
      let controller = result.controller;
      let method = result.method;
      let data = result.data;
      await method.call(controller, req, res, data);
    }
  } catch (err) {
    logger.error(err.message, err);
    res.send({
      code: 1,
      msg: '处理请求时发生异常'
    });
  }
});

router.get('/download', async function (req, res, next) {
  try {
    let result = baseService.preProcess(req);
    if (result.code !== 0) {
      res.send(result);
    } else {
      let controller = result.controller;
      let method = result.method;
      let data = result.data;
      await method.call(controller, req, res, data);
    }
  } catch (err) {
    logger.error(err.message, err);
    let str = '下载失败：' + err.message;
    res.writeHead(200, { 'Content-Disposition': 'attachment; filename=error.txt' });
    res.end(Buffer.from(str, 'utf-8'));
  }
});

router.post('/upload', multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10485760 }
}).single('file'), async function (req, res, next) {
  try {
    let result = baseService.preProcess(req);
    if (result.code !== 0) {
      res.send(result);
    } else {
      let controller = result.controller;
      let method = result.method;
      let data = result.data;
      await method.call(controller, req, res, data);
    }
  } catch (err) {
    logger.error(err.message, err);
    res.send({
      code: 1,
      msg: '处理请求时发生异常'
    });
  }
});

module.exports = router;