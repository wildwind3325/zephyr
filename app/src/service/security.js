var data = require('../util/data');
var DB = require('../dao/db');

class SecurityService {
  constructor() {
    this.menuTree = [];
    this.menus = {};
    this.privileges = [];
    this.roles = {};
  }

  async init() {
    let db = new DB();
    let tree = await db.find('select * from `base_menu` where `parent_id` = 0 and `type` = 0');
    let list = await db.find('select * from `base_menu` where `parent_id` <> 0 and `type` = 0');
    for (let i = 0; i < tree.length; i++) {
      data.getTree(list, tree[i]);
    }
    this.menuTree = tree;
    let menus = await db.findByTable('base_menu', [], '', '', {});
    this.menus = {};
    this.privileges = [];
    for (let i = 0; i < menus.length; i++) {
      this.menus[menus[i].id + ''] = menus[i];
      if (menus[i].type === 1) this.privileges.push(menus[i].code)
    }
    let roles = await db.findByTable('base_role', [], '', '', {});
    this.roles = {};
    for (let i = 0; i < roles.length; i++) {
      let role = {
        menus: [],
        privileges: []
      };
      let role_menus = JSON.parse(roles[i].menus);
      for (let j = 0; j < role_menus.length; j++) {
        let menu = this.menus[role_menus[j] + ''];
        if (menu.type === 0) role.menus.push(menu.route);
        else role.privileges.push(menu.code);
      }
      this.roles[roles[i].id + ''] = role;
    }
  }

  hasPrivilege(user, code) {
    if (this.privileges.indexOf(code) < 0) return true;
    for (let i = 0; i < user.roles.length; i++) {
      let role = this.roles[user.roles[i] + ''];
      if (!role) continue;
      if (role.privileges.indexOf(code) >= 0) {
        return true;
      }
    }
    return false;
  }
}

module.exports = new SecurityService();