var DB = require('../../dao/db');

var dataUtil = require('../../util/data');

class OrgnizationController {
  constructor() {
    this.rules = {
      list: {},
      add: {
        parent_id: /^[1-9]\d*$/,
        label: /^.{1,32}$/
      },
      edit: {
        id: /^[1-9]\d*$/,
        parent_id: /\d+$/,
        label: /^.{1,32}$/
      },
      remove: {
        id: /^[1-9]\d*$/
      }
    };
  }

  async list(req, res, data) {
    let db = new DB();
    let tree = await db.find('select * from `base_department` where `parent_id` = 0 limit 1');
    if (tree.length > 0) {
      let list = await db.find('select * from `base_department` where `parent_id` <> 0');
      dataUtil.getTree(list, tree[0]);
    }
    res.send({
      code: 0,
      data: tree
    });
  }

  async add(req, res, data) {
    let db = new DB();
    let item = Object.assign({
      created_by: req.auth.account,
      updated_by: req.auth.account
    }, data);
    await db.insert('base_department', item);
    res.send({ code: 0 });
  }

  async edit(req, res, data) {
    let db = new DB();
    let item = Object.assign({ updated_by: req.auth.account }, data);
    await db.update('base_department', item);
    res.send({ code: 0 });
  }

  async remove(req, res, data) {
    let db = new DB();
    let item = await db.findById('base_department', data.id);
    if (item.parent_id === 0) {
      res.send({
        code: 1,
        msg: 'system.msg.immortal'
      });
      return;
    }
    let countSub = await db.find('select count(*) total from `base_department` where `parent_id` = :id', { id: data.id });
    let countUser = await db.find('select count(*) total from `base_user` where `department_id` = :id', { id: data.id });
    if (countSub[0].total > 0 || countUser[0].total > 0) {
      res.send({
        code: 1,
        msg: 'system.msg.notEmpty'
      });
      return;
    }
    await db.delete('base_department', data.id);
    res.send({ code: 0 });
  }
}

module.exports = new OrgnizationController();