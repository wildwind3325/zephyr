import { createI18n } from 'vue-i18n';
import en from './en';
import zh from './zh';

let locale = '';
let lang = (navigator.language || navigator.browserLanguage).toLowerCase();
if (lang.indexOf('zh') >= 0) {
  locale = 'zh';
} else {
  locale = 'en';
}
locale = localStorage.getItem('lang') || locale;
localStorage.setItem('lang', locale);

let i18n = createI18n({
  allowComposition: true,
  globalInjection: true,
  legacy: false,
  locale: locale,
  messages: {
    en: en,
    zh: zh
  }
});

export default i18n;