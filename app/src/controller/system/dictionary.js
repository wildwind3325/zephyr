var DB = require('../../dao/db');

class DictionaryController {
  constructor() {
    this.rules = {
      list: {},
      add: {
        code: /^[a-zA-Z0-9\.]{1,64}$/,
        label: /^.{1,32}$/,
        value: /^[\s\S]+$/,
        memo: /^.{0,512}$/
      },
      edit: {
        id: /^[1-9]\d*$/,
        code: /^[a-zA-Z0-9\.]{1,64}$/,
        label: /^.{1,32}$/,
        value: /^[\s\S]+$/,
        memo: /^.{0,512}$/
      },
      remove: {
        id: /^[1-9]\d*$/
      }
    };
  }

  async list(req, res, data) {
    let db = new DB();
    let where = '';
    let params = {};
    if (data.keyword) {
      where += ' where `code` like :keyword or `label` like :keyword';
      params.keyword = '%' + data.keyword + '%';
    }
    let result = await db.findByPage({
      fields: [],
      table: 'base_lov',
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
    await db.insert('base_lov', item);
    res.send({
      code: 0,
      data: item
    });
  }

  async edit(req, res, data) {
    let db = new DB();
    let item = Object.assign({ updated_by: req.auth.account }, data);
    await db.update('base_lov', item);
    res.send({ code: 0 });
  }

  async remove(req, res, data) {
    let db = new DB();
    await db.delete('base_lov', data.id);
    res.send({ code: 0 });
  }
}

module.exports = new DictionaryController();