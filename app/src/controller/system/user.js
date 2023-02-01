var DB = require('../../dao/db');
var util = require('../../util/util');

class UserController {
  constructor() {
    this.rules = {
      list: {},
      add: {
        account: /^.{1,32}$/,
        password: /^.{1,32}$/,
        code: /^.{0,32}$/,
        name: /^.{1,32}$/,
        email: /^.{0,64}$/,
        mobile: /^.{0,32}$/,
        department_id: /^\d*$/,
        station_id: /^\d*$/,
        roles: (val, data) => {
          try {
            let arr = JSON.parse(val);
            return arr instanceof Array;
          } catch (err) {
            return false;
          }
        },
        status: /^[01]{1}$/,
        is_admin: /^[01]{1}$/,
        memo: /^.{0,512}$/
      },
      edit: {
        id: /^[1-9]\d*$/,
        account: /^.{1,32}$/,
        password: /^.{0,32}$/,
        code: /^.{0,32}$/,
        name: /^.{1,32}$/,
        email: /^.{0,64}$/,
        mobile: /^.{0,32}$/,
        department_id: /^\d*$/,
        station_id: /^\d*$/,
        roles: (val, data) => {
          try {
            let arr = JSON.parse(val);
            return arr instanceof Array;
          } catch (err) {
            return false;
          }
        },
        status: /^[01]{1}$/,
        is_admin: /^[01]{1}$/,
        memo: /^.{0,512}$/
      },
      remove: {
        id: /^[1-9]\d*$/
      }
    };
  }

  async list(req, res, data) {
    let db = new DB();
    let where = 'where 1 = 1';
    let params = {};
    if (data.department_id) {
      where += ' and `department_id` = :department_id';
      params.department_id = data.department_id;
    }
    if (data.station_id) {
      where += ' and `station_id` = :station_id';
      params.station_id = data.station_id;
    }
    if (data.status) {
      where += ' and `status` = :status';
      params.status = data.status;
    }
    if (data.keyword) {
      where += ' and (`account` like :keyword or `code` like :keyword or `name` like :keyword)';
      params.keyword = '%' + data.keyword + '%';
    }
    let result = await db.findByPage({
      fields: [],
      table: 'view_base_user',
      where: where,
      params: params,
      pageSize: data.pageSize,
      pageNumber: data.pageNumber,
      orderBy: ''
    });
    res.send({
      code: 0,
      data: result
    });
  }

  async add(req, res, data) {
    let db = new DB();
    let item = Object.assign({
      created_at: new Date(),
      created_by: req.auth.account,
      updated_at: new Date(),
      updated_by: req.auth.account
    }, data);
    item.password = util.md5(item.password + item.account);
    if (item.is_admin === 1 && req.auth.is_admin === 0) {
      res.send({
        code: 1,
        msg: 'system.user.notAdmin'
      });
      return;
    }
    await db.insert('base_user', item);
    res.send({ code: 0 });
  }

  async edit(req, res, data) {
    let db = new DB();
    let user = await db.findById('base_user', data.id);
    let item = Object.assign({ updated_by: req.auth.account }, data);
    if (user.is_admin === 1 && req.auth.is_admin === 0) {
      res.send({
        code: 1,
        msg: 'system.user.notAdmin'
      });
      return;
    }
    if (item.password) {
      item.password = util.md5(item.password + item.account);
    } else {
      delete item.password;
    }
    await db.update('base_user', item);
    res.send({ code: 0 });
  }

  async remove(req, res, data) {
    let db = new DB();
    let user = await db.findById('base_user', data.id);
    if (user.is_admin === 1 && req.auth.is_admin === 0) {
      res.send({
        code: 1,
        msg: 'system.user.notAdmin'
      });
      return;
    }
    if (user.id === req.auth.id) {
      res.send({
        code: 1,
        msg: 'system.user.selfDelete'
      });
      return;
    }
    await db.delete('base_user', data.id);
    res.send({ code: 0 });
  }
}

module.exports = new UserController();