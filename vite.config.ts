/**
 * @file Vite 构建配置文件
 * @description 配置 Vite 开发服务器和构建选项
 */

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()], // 启用 Vue 3 支持
})
