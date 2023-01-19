<template>
  <router-view v-loading.fullscreen.lock="loading" />
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      loading: false
    };
  },
  mounted() {
    window.$spin = {
      show: () => { this.loading = true; },
      hide: () => { this.loading = false; }
    };
  }
};
</script>