import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import './util/enhance';
import i18n from './i18n/index';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import JsonEditorVue from 'json-editor-vue';
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js';
import './main.css';

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(JsonEditorVue);

VMdEditor.use(githubTheme, {
  Hljs: hljs,
});
app.use(VMdEditor);

app.use(router).use(i18n).use(ElementPlus).mount('#app');