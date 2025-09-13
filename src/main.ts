/**
 * @file 应用程序入口文件
 * @description Vue 3 应用初始化，配置路由、UI组件库和全局样式
 */

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import router from './router'

// 引入 Font Awesome 图标库
import '@fortawesome/fontawesome-free/css/all.css'

// 创建 Vue 应用实例并配置插件
createApp(App)
  .use(router)        // 配置路由
  .use(ElementPlus)   // 配置 Element Plus UI 组件库
  .mount('#app')      // 挂载到 DOM
