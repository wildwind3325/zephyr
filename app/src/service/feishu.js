var http = require('../util/http');

class FeishuService {
  constructor() {
    this.app_id = '';
    this.app_secret = '';
    this.app_access_token = '';
    this.expire_time = new Date();
  }

  async setup(app_id, app_secret) {
    this.app_id = app_id;
    this.app_secret = app_secret;
    await this.token(true);
  }

  async token(forced) {
    let minutes = (this.expire_time - new Date()) / 60000;
    if (forced || !this.app_access_token || minutes <= 20) {
      try {
        let response = await http.request({
          method: 'POST',
          url: 'https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal',
          body: {
            app_id: this.app_id,
            app_secret: this.app_secret
          },
          json: true
        });
        let data = response.body;
        if (data.code !== 0) {
          return data;
        }
        this.app_access_token = data.app_access_token;
        let time = new Date();
        this.expire_time = new Date(time.setSeconds(time.getSeconds() + data.expire));
        return { code: 0 };
      } catch (error) {
        return {
          code: 1,
          msg: error.message
        };
      }
    } else {
      return { code: 0 };
    }
  }

  async login(code) {
    let result = await this.token();
    if (result.code !== 0) {
      return result;
    }
    try {
      let response = await http.request({
        method: 'POST',
        url: 'https://open.feishu.cn/open-apis/authen/v1/access_token',
        headers: {
          Authorization: 'Bearer ' + this.app_access_token
        },
        body: {
          grant_type: 'authorization_code',
          code: code
        },
        json: true
      });
      let data = response.body;
      return data;
    } catch (error) {
      return {
        code: 1,
        msg: error.message
      };
    }
  }

  async getUserById(user_id) {
    let result = await this.token();
    if (result.code !== 0) {
      return result;
    }
    try {
      let response = await http.request({
        method: 'GET',
        url: 'https://open.feishu.cn/open-apis/contact/v3/users/' + user_id + '?user_id_type=user_id',
        headers: {
          Authorization: 'Bearer ' + this.app_access_token
        },
        json: true
      });
      let data = response.body;
      if (data.code !== 0) {
        return data;
      }
      return {
        code: 0,
        data: data.data.user
      };
    } catch (error) {
      return {
        code: 1,
        msg: error.message
      };
    }
  }

  async getUserByEmail(email) {
    let result = await this.token();
    if (result.code !== 0) {
      return result;
    }
    try {
      let response = await http.request({
        method: 'POST',
        url: 'https://open.feishu.cn/open-apis/contact/v3/users/batch_get_id?user_id_type=user_id',
        headers: {
          Authorization: 'Bearer ' + this.app_access_token
        },
        body: {
          emails: [email]
        },
        json: true
      });
      let data = response.body;
      if (data.code !== 0) {
        return data;
      }
      return {
        code: 0,
        data: data.data.user_list[0]
      };
    } catch (error) {
      return {
        code: 1,
        msg: error.message
      };
    }
  }

  async sendMessage(id_type, user_id, msg_type, content) {
    let result = await this.token();
    if (result.code !== 0) {
      return result;
    }
    try {
      let response = await http.request({
        method: 'POST',
        url: 'https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=' + id_type,
        headers: {
          Authorization: 'Bearer ' + this.app_access_token
        },
        body: {
          receive_id: user_id,
          content: JSON.stringify(content),
          msg_type: msg_type
        },
        json: true
      });
      let data = response.body;
      return data;
    } catch (error) {
      return {
        code: 1,
        msg: error.message
      };
    }
  }
}

module.exports = new FeishuService();