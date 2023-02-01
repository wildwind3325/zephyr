var DB = require('../../dao/db');

class StationController {
  constructor() {
    this.rules = {
      list: {},
      add: {
        label: /^.{1,32}$/
      },
      edit: {
        id: /^[1-9]\d*$/,
        label: /^.{1,32}$/
      },
      remove: {
        id: /^[1-9]\d*$/
      }
    };
  }

  async list(req, res, data) {
    let db = new DB();
    let list = await db.find('select * from `base_station`');
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
    await db.insert('base_station', item);
    res.send({
      code: 0,
      data: item
    });
  }

  async edit(req, res, data) {
    let db = new DB();
    let item = Object.assign({ updated_by: req.auth.account }, data);
    await db.update('base_station', item);
    res.send({ code: 0 });
  }

  async remove(req, res, data) {
    let db = new DB();
    let count = await db.find('select count(*) total from `base_user` where `station_id` = :id', { id: data.id });
    if (count[0].total > 0) {
      res.send({
        code: 1,
        msg: 'system.msg.notEmpty'
      });
      return;
    }
    await db.delete('base_station', data.id);
    res.send({ code: 0 });
  }
}

module.exports = new StationController();