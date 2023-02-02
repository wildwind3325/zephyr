<template>
  <div style="padding: 20px; font-size: 14px;">
    <p>您已退出系统，<span class="link" @click="$router.replace('/')">点此</span>继续。</p>
    <p>You've logged out, click <span class="link" @click="$router.replace('/')">here</span> to continue.</p>
  </div>
</template>

<script>
export default {
  name: 'Logout'
};
</script>

<style scoped>
.link {
  cursor: pointer;
  color: blue;
}
</style>