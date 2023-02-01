var DB = require('../dao/db');
var util = require('../util/util');
var securityService = require('./security');

class BaseService {
  constructor() {
    this.safeModules = ['login', 'data'];
  }

  preProcess(req, anonymous) {
    let data = Object.assign({}, req.query, req.body);
    let module = data._module;
    let action = data._action;
    if (!/^[a-zA-Z0-9\.]+$/.test(module) || !/^[a-zA-Z0-9]+$/.test(action)) {
      return {
        code: 1,
        msg: 'system.msg.wrongRequest'
      };
    }
    if (anonymous !== true || this.safeModules.indexOf(module) < 0) {
      if (!req.auth) {
        return {
          code: -1,
          msg: 'system.msg.unauthorized'
        };
      }
      if (req.auth.is_admin === 0) {
        if (!securityService.hasPrivilege(req.auth, module + '.' + action)) {
          return {
            code: 1,
            msg: 'system.msg.permissionDenied'
          };
        }
      }
    }
    module = module.replace(/\./g, '/');
    let controller, method;
    try {
      controller = require('../controller/' + module);
      method = controller[action];
    } catch (err) { }
    if (!method || !method instanceof Function) {
      return {
        code: 1,
        msg: 'system.msg.nonexistent'
      };
    }
    let rules = controller.rules;
    if (rules && rules[action]) {
      for (let key in rules[action]) {
        let rule = rules[action][key];
        if ((rule instanceof RegExp && !rule.test(data[key]))
          || (rule instanceof Function && !rule.call(controller, data[key]))) {
          return {
            code: 1,
            msg: 'system.msg.wrongParam'
          };
        }
      }
    }
    delete data._module;
    delete data._action;
    return {
      code: 0,
      controller: controller,
      method: method,
      data: data
    };
  }

  async writeLog(file, category, content, operator) {
    let db = new DB();
    await db.insert('base_log', {
      module: util.getPath(file),
      category: category,
      content: content,
      created_by: operator
    });
  }

  async getConfig(code) {
    let db = new DB();
    let list = await db.find('select `value` from `base_config` where `code` = :code', { code: code });
    if (list.length > 0) return list[0].value;
    return null;
  }
}

module.exports = new BaseService();