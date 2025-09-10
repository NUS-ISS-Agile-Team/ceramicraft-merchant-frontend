import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
// 引入全局样式
import './assets/styles/global.css'
import App from './App.vue'
import router from './router'

// 引入 Font Awesome 图标
import '@fortawesome/fontawesome-free/css/all.css'

createApp(App)
  .use(router)
  .use(ElementPlus)
  .mount('#app')
