<template>
  <el-config-provider :locale="locale">
    <router-view v-loading.fullscreen.lock="loading" />
  </el-config-provider>
</template>

<script>
import { ElConfigProvider } from 'element-plus';
import en from 'element-plus/es/locale/lang/en';
import zh from 'element-plus/es/locale/lang/zh-cn';
export default {
  name: 'App',
  components: {
    ElConfigProvider
  },
  data() {
    return {
      locale: en,
      loading: false
    };
  },
  mounted() {
    window.$locale = {
      set: val => {
        if (val === 'zh') this.locale = zh;
        else this.locale = en;
      }
    };
    window.$locale.set(localStorage.getItem('lang') || 'zh');
    window.$spin = {
      show: () => { this.loading = true; },
      hide: () => { this.loading = false; }
    };
  }
};
</script>