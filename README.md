# CeramicCraft 用户端

> 陶瓷工艺品电商平台用户端 - 基于 Vue 3 + TypeScript 构建

## 项目介绍

CeramicCraft 用户端是一个陶瓷工艺品展示和购买平台，为用户提供浏览、购买陶瓷产品的功能。

## 技术栈

- Vue 3 + TypeScript + Vite
- Vue Router
- Element Plus
- Sass

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 类型检查
npm run type-check
```

## 项目结构

```
src/
├── components/     # 公共组件
├── views/         # 页面
│   ├── Home.vue   # 首页
│   └── Login.vue  # 登录注册
├── layouts/       # 布局组件
├── router/        # 路由
├── types/         # TypeScript 类型定义
├── assets/        # 静态资源
└── main.ts        # 入口文件
```

## 代码规范

### 命名规范
- 组件文件：`PascalCase.vue`
- TypeScript 文件：`camelCase.ts`
- 类型定义：`PascalCase`
- 变量/函数：`camelCase`
- CSS类名：`kebab-case`

### Vue 组件结构
```vue
<template>
  <!-- 模板 -->
</template>

<script setup lang="ts">
// TypeScript 逻辑
</script>

<style scoped>
/* 样式 */
</style>
```

### TypeScript 规范
```typescript
// 接口定义
interface User {
  id: number
  name: string
  email: string
}

// 函数类型注解
function getUser(id: number): Promise<User> {
  // 实现逻辑
}

// Props 类型定义
interface Props {
  user: User
  showDetails?: boolean
}
```

## 注释规范

```typescript
/**
 * 获取用户信息
 * @param id - 用户ID
 * @returns 用户信息对象
 */
async function getUser(id: number): Promise<User> {
  // 实现逻辑
}
```

```vue
<template>
  <!-- 重要区域注释 -->
  <div class="user-info">
    <!-- 用户头像 -->
    <img :src="avatar" alt="头像" />
  </div>
</template>

<script setup lang="ts">
// Props 类型定义
interface Props {
  /** 用户头像地址 */
  avatar: string
}
</script>
```

## Git 提交规范

```
type: 简短描述

feat: 新功能
fix: 修复问题
docs: 文档更新
style: 样式调整
type: 类型定义更新
```

示例：
```
feat: 添加用户登录功能
fix: 修复首页商品展示问题
type: 添加产品相关类型定义
```