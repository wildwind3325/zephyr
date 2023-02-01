var DB = require('../../dao/db');

var securityService = require('../../service/security');

class RoleController {
  constructor() {
    this.rules = {
      list: {},
      add: {
        label: /^.{1,32}$/,
        menus: (val, data) => {
          try {
            let arr = JSON.parse(val);
            return arr instanceof Array;
          } catch (err) {
            return false;
          }
        }
      },
      edit: {
        id: /^[1-9]\d*$/,
        label: /^.{1,32}$/,
        menus: (val, data) => {
          try {
            let arr = JSON.parse(val);
            return arr instanceof Array;
          } catch (err) {
            return false;
          }
        }
      },
      remove: {
        id: /^[1-9]\d*$/
      }
    };
  }

  async list(req, res, data) {
    let db = new DB();
    let list = await db.find('select * from `base_role`');
    res.send({
      code: 0,
      data: list
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
    await db.insert('base_role', item);
    await securityService.init();
    res.send({
      code: 0,
      data: item
    });
  }

  async edit(req, res, data) {
    let db = new DB();
    let item = Object.assign({ updated_by: req.auth.account }, data);
    await db.update('base_role', item);
    await securityService.init();
    res.send({ code: 0 });
  }

  async remove(req, res, data) {
    let db = new DB();
    let users = await db.find('select * from `base_user`');
    for (let i = 0; i < users.length; i++) {
      let roles = JSON.parse(users[i].roles);
      let pos = roles.indexOf(data.id);
      if (pos >= 0) {
        roles.splice(pos, 1);
        users[i].roles = JSON.stringify(roles);
        await db.update('base_user', users[i]);
      }
    }
    await db.delete('base_role', data.id);
    await securityService.init();
    res.send({ code: 0 });
  }
}

module.exports = new RoleController();