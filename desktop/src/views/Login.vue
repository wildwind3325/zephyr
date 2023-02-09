<template>
  <div class="div-center login-page">
    <div class="div-center login-box">
      <div class="login-box-title">{{ $t('system.login.title') }}</div>
      <div class="login-box-item">
        <el-radio-group v-model="locale" @change="changeLocale">
          <el-radio label="zh">中文</el-radio>
          <el-radio label="en">English</el-radio>
        </el-radio-group>
      </div>
      <div class="login-box-item">
        <el-input v-model="account" prefix-icon="User" :placeholder="$t('system.login.accountHint')" />
      </div>
      <div class="login-box-item">
        <el-input v-model="password" type="password" prefix-icon="Lock" :placeholder="$t('system.login.passwordHint')"
          @keyup.enter.native="login" />
      </div>
      <div class="login-box-item">
        <el-button type="primary" style="width: 100%;" @click="login">{{ $t('system.login.login') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { login, loginByFeishu, status } from '../api/login';
export default {
  name: 'Login',
  data() {
    return {
      locale: localStorage.getItem('lang') || 'zh',
      account: localStorage.getItem('account') || '',
      password: ''
    };
  },
  async mounted() {
    try {
      let target = localStorage.getItem('target_uri') || '/home';
      if (this.$route.query.code) {
        let res = await loginByFeishu(this.$route.query.code);
        if (res.data.code !== 0) {
          this.$message({
            type: 'error',
            message: this.$t('system.login.loginFailed', [this.$t(res.data.msg)])
          });
        } else {
          localStorage.removeItem('target_uri');
          this.$router.replace(target);
        }
      } else {
        let res = await status();
        if (res.data.code === 0 && res.data.data.loggedIn) {
          localStorage.removeItem('target_uri');
          this.$router.replace(target);
        } else if (res.data.data.app_id) {
          let url = 'https://open.feishu.cn/open-apis/authen/v1/index?app_id=' + res.data.data.app_id + '&redirect_uri=' + encodeURIComponent(location.origin + location.pathname + '#/');
          location.href = url;
        }
      }
    } catch (err) { }
  },
  methods: {
    changeLocale() {
      this.$i18n.locale = this.locale;
      window.$locale.set(this.locale);
      localStorage.setItem('lang', this.locale);
    },
    async login() {
      if (!this.account || !this.password) {
        this.$message({
          type: 'warning',
          message: this.$t('system.view.incomplete')
        });
        return;
      }
      try {
        let res = await login(this.account, this.password);
        if (res.data.code !== 0) {
          this.$message({
            type: 'error',
            message: this.$t('system.login.loginFailed', [this.$t(res.data.msg)])
          });
          return;
        }
        let target = localStorage.getItem('target_uri') || '/home';
        localStorage.removeItem('target_uri');
        localStorage.setItem('account', this.account);
        this.$router.replace(target);
      } catch (err) {
        this.$message({
          type: 'error',
          message: this.$t('system.login.loginFailed', [err.message])
        });
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  background-color: #2d3a4b;
}

.login-box {
  width: 300px;
  flex-direction: column;
}

.login-box-title {
  font-size: 32px;
  color: #ffffff;
}

.login-box-item {
  width: 100%;
  margin-top: 20px;
}
</style>