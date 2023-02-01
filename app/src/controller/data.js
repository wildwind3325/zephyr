var DB = require('../dao/db');

class DataController {
  constructor() {
    this.rules = {
      picker: {
        code: /^[a-zA-Z0-9\.]{1,64}$/,
        depth: (val, data) => !isNaN(parseInt(val))
      }
    };
  }

  async picker(req, res, data) {
    let db = new DB();
    let list = await db.find('select * from `base_lov` where `code` = :code', { code: data.code });
    if (list.length === 0) {
      res.send({
        code: 1,
        msg: 'system.data.notFound'
      });
      return;
    }
    let tree = JSON.parse(list[0].value);
    let depth = parseInt(data.depth);
    if (depth > 0) {
      for (let i = 0; i < tree.length; i++) {
        this.limitDepth(tree[i], depth, 2);
      }
    }
    res.send({
      code: 0,
      data: tree
    });
  }

  limitDepth(item, maxDepth, depth) {
    item.children = item.children || [];
    if (depth > maxDepth) {
      delete item.children;
      return;
    }
    for (let i = 0; i < item.children.length; i++) {
      this.limitDepth(item.children[i], maxDepth, depth + 1);
    }
  }
}

module.exports = new DataController();