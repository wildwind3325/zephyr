<template>
  <div style="padding: 20px; font-size: 14px;">
    您已退出系统，<span class="link" @click="$router.push('/')">点此</span>继续。
  </div>
</template>

<script>
import { logout } from '../api/login';
export default {
  name: 'Logout',
  async mounted() {
    try { await logout(); } catch (err) { }
  }
};
</script>

<style scoped>
.link {
  cursor: pointer;
  color: blue;
}
</style>