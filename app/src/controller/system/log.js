var DB = require('../../dao/db');

class LogController {
  constructor() {
    this.rules = {
      list: {}
    };
  }

  async list(req, res, data) {
    let db = new DB();
    let where = 'where 1 = 1';
    let params = {};
    if (data.module) {
      where += ' and `module` like :module';
      params.module = '%' + data.module + '%';
    }
    if (data.category) {
      where += ' and `category` = :category';
      params.category = data.category;
    }
    if (data.keyword) {
      where += ' and `content` like :keyword';
      params.keyword = '%' + data.keyword + '%';
    }
    if (data.from) {
      where += ' and `created_at` >= :from';
      params.from = data.from;
    }
    if (data.to) {
      let date = new Date(data.to);
      date.setDate(date.getDate() + 1);
      where += ' and `created_at` < :to';
      params.to = date;
    }
    let result = await db.findByPage({
      fields: [],
      table: 'base_log',
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
}

module.exports = new LogController();