<template>
  <div>
    <el-button type="warning" @click="logout">注销</el-button>
    <router-view />
  </div>
</template>

<script>
import { logout } from '../api/login';
export default {
  name: 'Master',
  methods: {
    logout() {
      this.$router.replace('/logout');
    }
  }
}
</script>