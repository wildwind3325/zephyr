var yazl = require('yazl');

var DB = require('../../dao/db');

class I18nController {
  constructor() {
    this.rules = {
      list: {},
      add: {
        code: /^[a-zA-Z0-9\.]{1,64}$/,
        text_en: /^.{1,512}$/,
        text_zh: /^.{1,512}$/
      },
      edit: {
        id: /^[1-9]\d*$/,
        code: /^[a-zA-Z0-9\.]{1,64}$/,
        text_en: /^.{1,512}$/,
        text_zh: /^.{1,512}$/
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
      where += ' where `code` like :keyword or `text_en` like :keyword or `text_zh` like :keyword';
      params.keyword = '%' + data.keyword + '%';
    }
    let result = await db.findByPage({
      fields: [],
      table: 'base_i18n',
      where: where,
      params: params,
      pageSize: data.pageSize,
      pageNumber: data.pageNumber,
      orderBy: 'order by `code`'
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
    await db.insert('base_i18n', item);
    res.send({
      code: 0,
      data: item
    });
  }

  async edit(req, res, data) {
    let db = new DB();
    let item = Object.assign({ updated_by: req.auth.account }, data);
    await db.update('base_i18n', item);
    res.send({ code: 0 });
  }

  async remove(req, res, data) {
    let db = new DB();
    await db.delete('base_i18n', data.id);
    res.send({ code: 0 });
  }

  async download(req, res, data) {
    let db = new DB();
    let list = await db.find('select * from `base_i18n`');
    let en = {}, zh = {};
    for (let i = 0; i < list.length; i++) {
      let keys = list[i].code.split('.');
      let en_obj = en, zh_obj = zh;
      for (let j = 0; j < keys.length - 1; j++) {
        if (!en_obj[keys[j]]) {
          en_obj[keys[j]] = {};
          zh_obj[keys[j]] = {};
        }
        en_obj = en_obj[keys[j]];
        zh_obj = zh_obj[keys[j]];
      }
      en_obj[keys[keys.length - 1]] = list[i].text_en;
      zh_obj[keys[keys.length - 1]] = list[i].text_zh;
    }
    var zf = new yazl.ZipFile();
    let en_buf = Buffer.from('export default ' + JSON.stringify(en) + ';', 'utf-8');
    let zh_buf = Buffer.from('export default ' + JSON.stringify(zh) + ';', 'utf-8');
    zf.addBuffer(en_buf, 'en.js');
    zf.addBuffer(zh_buf, 'zh.js');
    res.writeHead(200, [['Content-Type', 'application/zip'], ['Content-Disposition', 'attachment; filename=i18n.zip']]);
    zf.outputStream.pipe(res);
    zf.end();
  }
}

module.exports = new I18nController();