import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import { createI18n } from 'vue-i18n'
import en from './i18n/en.json'
import zh from './i18n/zh.json'
const i18n = createI18n({
  locale: 'zh',
  legacy: false,
  fallbackLocale: 'zh',
  messages: {
    zh,
    en
  }
})
const app = createApp(App)

app.use(router)

app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(i18n)
app.mount('#app')
