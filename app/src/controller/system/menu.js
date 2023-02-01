var DB = require('../../dao/db');

var dataUtil = require('../../util/data');
var securityService = require('../../service/security');

class MenuController {
  constructor() {
    this.rules = {
      list: {},
      add: {
        parent_id: /^\d+$/,
        label: /^.{1,32}$/,
        label_en: /^.{1,32}$/,
        type: /^[01]{1}$/,
        route: /.{0,128}/,
        icon: /.{0,32}/,
        code: /[a-zA-Z0-9\.]{0,512}/
      },
      edit: {
        id: /^[1-9]\d*$/,
        parent_id: /^\d+$/,
        label: /^.{1,32}$/,
        label_en: /^.{1,32}$/,
        type: /^[01]{1}$/,
        route: /.{0,128}/,
        icon: /.{0,32}/,
        code: /[a-zA-Z0-9\.]{0,512}/
      },
      remove: {
        id: /^[1-9]\d*$/
      }
    };
  }

  async list(req, res, data) {
    let db = new DB();
    let tree = await db.find('select * from `base_menu` where `parent_id` = 0');
    let list = await db.find('select * from `base_menu` where `parent_id` <> 0');
    for (let i = 0; i < tree.length; i++) {
      dataUtil.getTree(list, tree[i]);
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
    await db.insert('base_menu', item);
    await securityService.init();
    res.send({ code: 0 });
  }

  async edit(req, res, data) {
    let db = new DB();
    let item = Object.assign({ updated_by: req.auth.account }, data);
    await db.update('base_menu', item);
    await securityService.init();
    res.send({ code: 0 });
  }

  async remove(req, res, data) {
    let db = new DB();
    let count = await db.find('select count(*) total from `base_menu` where `parent_id` = :id', { id: data.id });
    if (count[0].total > 0) {
      res.send({
        code: 1,
        msg: 'system.msg.notEmpty'
      });
      return;
    }
    let roles = await db.find('select * from `base_role`');
    for (let i = 0; i < roles.length; i++) {
      let menus = JSON.parse(roles[i].menus);
      let pos = menus.indexOf(data.id);
      if (pos >= 0) {
        menus.splice(pos, 1);
        roles[i].menus = JSON.stringify(menus);
        await db.update('base_role', roles[i]);
      }
    }
    await db.delete('base_menu', data.id);
    await securityService.init();
    res.send({ code: 0 });
  }

  async init(req, res, data) {
    let tree = JSON.parse(JSON.stringify(securityService.menuTree));
    let roles = req.auth.roles;
    let menus = [];
    let dic = {}, dic_en = {};
    for (let i = 0; i < roles.length; i++) {
      let arr = securityService.roles[roles[i] + ''].menus;
      for (let j = 0; j < arr.length; j++) {
        if (menus.indexOf(arr[j]) < 0) menus.push(arr[j]);
      }
    }
    for (let i = tree.length - 1; i >= 0; i--) {
      if (menus.indexOf(tree[i].route) < 0) {
        tree.splice(i, 1);
      } else {
        dic[tree[i].route] = tree[i].label;
        dic_en[tree[i].route] = tree[i].label_en;
        this.genMenuTree(tree[i], menus, dic, dic_en);
      }
    }
    res.send({
      code: 0,
      data: {
        tree: tree,
        dic: dic,
        dic_en: dic_en
      }
    });
  }

  genMenuTree(node, menus, dic, dic_en) {
    if (node.children.length === 0) {
      delete node.children;
      return;
    }
    for (let i = node.children.length - 1; i >= 0; i--) {
      if (menus.indexOf(node.children[i].route) < 0) {
        node.children.splice(i, 1);
      } else {
        dic[node.children[i].route] = node.children[i].label;
        dic_en[node.children[i].route] = node.children[i].label_en;
        this.genMenuTree(node.children[i], menus, dic, dic_en);
      }
    }
  }
}

module.exports = new MenuController();