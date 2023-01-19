<template>
  <div></div>
</template>

<script>
import { login, status } from '../api/login';
export default {
  name: 'Login',
  async mounted() {
    try {
      let target = localStorage.getItem('target_uri') || '/home';
      let res = await status();
      if (res.data.code === 0 && res.data.data.loggedIn) {
        localStorage.removeItem('target_uri');
        this.$router.replace(target);
      } else {
        if (this.$route.query.code) {
          let res = await login(this.$route.query.code);
          if (res.data.code !== 0) {
            this.$message({
              type: 'error',
              message: '登录失败：' + res.data.msg
            });
          } else {
            localStorage.removeItem('target_uri');
            this.$router.replace(target);
          }
        } else if (res.data.data.app_id) {
          let url = 'https://open.feishu.cn/open-apis/authen/v1/index?app_id=' + res.data.data.app_id + '&redirect_uri=' + encodeURIComponent(location.origin + location.pathname + '#/');
          location.href = url;
        }
      }
    } catch (err) { }
  }
}
</script>