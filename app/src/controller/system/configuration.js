var DB = require('../../dao/db');

class ConfigurationController {
  constructor() {
    this.rules = {
      listGroup: {},
      addGroup: {
        label: /^.{1,32}$/
      },
      editGroup: {
        id: /^[1-9]\d*$/,
        label: /^.{1,32}$/
      },
      removeGroup: {
        id: /^[1-9]\d*$/
      },
      list: {
        group_id: /^\d+$/
      },
      add: {
        group_id: /^[1-9]\d*$/,
        code: /^.{1,64}$/,
        label: /^.{1,64}$/,
        value: /^.{0,512}$/,
        memo: /^.{0,512}$/
      },
      edit: {
        id: /^[1-9]\d*$/,
        group_id: /^[1-9]\d*$/,
        code: /^.{1,64}$/,
        label: /^.{1,64}$/,
        value: /^.{0,512}$/,
        memo: /^.{0,512}$/
      },
      remove: {
        id: /^[1-9]\d*$/
      }
    };
  }

  async listGroup(req, res, data) {
    let db = new DB();
    let list = await db.find('select * from `base_config_group`');
    res.send({
      code: 0,
      data: list
    });
  }

  async addGroup(req, res, data) {
    let db = new DB();
    let item = Object.assign({
      created_at: new Date(),
      created_by: req.auth.account,
      updated_at: new Date(),
      updated_by: req.auth.account
    }, data);
    await db.insert('base_config_group', item);
    res.send({
      code: 0,
      data: item
    });
  }

  async editGroup(req, res, data) {
    let db = new DB();
    let item = Object.assign({ updated_by: req.auth.account }, data);
    await db.update('base_config_group', item);
    res.send({ code: 0 });
  }

  async removeGroup(req, res, data) {
    let db = new DB();
    let count = await db.find('select count(*) total from `base_config` where `group_id` = :id', { id: data.id });
    if (count[0].total > 0) {
      res.send({
        code: 1,
        msg: 'system.msg.notEmpty'
      });
      return;
    }
    await db.delete('base_config_group', data.id);
    res.send({ code: 0 });
  }

  async list(req, res, data) {
    let db = new DB();
    let sql = 'select * from `base_config` where 1 = 1';
    let params = {};
    if (parseInt(data.group_id) > 0) {
      sql += ' and `group_id` = :group_id';
      params.group_id = data.group_id;
    }
    if (data.keyword) {
      sql += ' and (`code` like :keyword or `label` like :keyword)';
      params.keyword = '%' + data.keyword + '%';
    }
    let list = await db.find(sql, params);
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
    await db.insert('base_config', item);
    res.send({
      code: 0,
      data: item
    });
  }

  async edit(req, res, data) {
    let db = new DB();
    let item = Object.assign({ updated_by: req.auth.account }, data);
    await db.update('base_config', item);
    res.send({ code: 0 });
  }

  async remove(req, res, data) {
    let db = new DB();
    await db.delete('base_config', data.id);
    res.send({ code: 0 });
  }
}

module.exports = new ConfigurationController();