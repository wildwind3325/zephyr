var DB = require('../dao/db');
var http = require('../util/http');

class CalendarController {
  constructor() {
    this.rules = {
      list: {
      },
      add: {
        from: /^.{10}$/,
        to: /^.{10}$/
      },
      edit: {
        id: /^[1-9]\d*$/,
        content: /^.*$/
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
    let result = await db.findByPage({
      fields: [],
      table: 'zp_report',
      where: where,
      params: params,
      pageSize: data.pageSize,
      pageNumber: data.pageNumber,
      orderBy: 'order by `id` desc'
    });
    res.send({
      code: 0,
      data: result
    });
  }

  async add(req, res, data) {
    let db = new DB();
    let url = 'http://172.16.0.169/redmine/time_entries.json?from=' + data.from + '&to=' + data.to + '&offset=';
    let authorization = 'Basic emhhbmdqdW4wMTo0NTYxMjNhYmM=';
    let offset = 0;
    let projects = {}, devs = {}, tsts = {}, bugs = {}, times = {};
    while (true) {
      let res = await http.request({
        method: 'GET',
        url: url + offset,
        headers: {
          'Authorization': authorization
        }
      });
      let list = res.data.time_entries;
      for (let i = 0; i < list.length; i++) {
        let entry = list[i];
        let issue_data = await http.request({
          method: 'GET',
          url: 'http://172.16.0.169/redmine/issues/' + entry.issue.id + '.json',
          headers: {
            'Authorization': authorization
          }
        });
        let issue = issue_data.data.issue;
        projects[issue.project.id + ''] = issue.project.name;
        if (times[issue.id + '']) {
          times[issue.id + ''] += entry.hours;
        } else {
          times[issue.id + ''] = entry.hours;
        }
        if (issue.tracker.id === 1) {
          if (devs[issue.id + '']) {
            devs[issue.id + ''].cost += entry.hours;
          } else {
            devs[issue.id + ''] = issue;
            devs[issue.id + ''].cost = entry.hours;
          }
        } else if (issue.tracker.id === 2) {
          if (tsts[issue.id + '']) {
            tsts[issue.id + ''].cost += entry.hours;
          } else {
            tsts[issue.id + ''] = issue;
            tsts[issue.id + ''].cost = entry.hours;
          }
        } else {
          if (bugs[issue.id + '']) {
            bugs[issue.id + ''].cost += entry.hours;
          } else {
            bugs[issue.id + ''] = issue;
            bugs[issue.id + ''].cost = entry.hours;
          }
        }
      }
      if (list.length < 25) break;
      offset += 25;
    }
    let content = '';
    for (let pid in projects) {
      content += '### [' + projects[pid] + ']\r\n';
      pid = parseInt(pid);
      content += '#### 开发工作\r\n';
      content += '|近期工作内容|负责人|进度|耗时|备注|\r\n';
      content += '|-|-|-|-|-|\r\n';
      for (let iid in devs) {
        if (devs[iid].project.id !== pid) continue;
        let issue = devs[iid];
        let subject = issue.subject;
        let person = issue.assigned_to ? issue.assigned_to.name : '';
        let progress = issue.done_ratio + '%';
        let cost = times[iid] + ' (' + issue.cost + ')';
        content += '|' + subject + '|' + person + '|' + progress + '|' + cost + '||\r\n';
        delete devs[iid];
      }
      content += '#### 测试工作\r\n';
      content += '|近期工作内容|负责人|进度|耗时|备注|\r\n';
      content += '|-|-|-|-|-|\r\n';
      for (let iid in tsts) {
        if (tsts[iid].project.id !== pid) continue;
        let issue = tsts[iid];
        let subject = issue.subject;
        let person = issue.author ? issue.author.name : '';
        let progress = issue.done_ratio + '%';
        let cost = times[iid] + ' (' + issue.cost + ')';
        content += '|' + subject + '|' + person + '|' + progress + '|' + cost + '||\r\n';
        delete tsts[iid];
      }
      content += '#### 缺陷清单\r\n';
      content += '|问题描述|创建人|状态|备注|\r\n';
      content += '|-|-|-|-|\r\n';
      for (let iid in bugs) {
        if (bugs[iid].project.id !== pid) continue;
        let issue = bugs[iid];
        let subject = issue.subject;
        let person = issue.author ? issue.author.name : '';
        let status = issue.status.name;
        content += '|' + subject + '|' + person + '|' + status + '||\r\n';
        delete bugs[iid];
      }
    }
    let item = {
      from: data.from,
      to: data.to,
      content: content,
      created_at: new Date(),
      created_by: req.auth.account,
      updated_at: new Date(),
      updated_by: req.auth.account
    };
    await db.insert('zp_report', item);
    res.send({
      code: 0,
      data: item
    });
  }

  async edit(req, res, data) {
    let db = new DB();
    let item = Object.assign({ updated_by: req.auth.account }, data);
    await db.update('zp_report', item);
    res.send({ code: 0 });
  }

  async remove(req, res, data) {
    let db = new DB();
    await db.delete('zp_report', data.id);
    res.send({ code: 0 });
  }
}

module.exports = new CalendarController();