# CeramicCraft 用户端
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

## API 集成

### 后端服务配置

项目集成了以下微服务：

1. **用户微服务** - `http://localhost:8080/user-ms/v1`
   - 用户登录：`POST /merchant/login`
   - 用户登出：`POST /merchant/logout`
   - 用户注册：`POST /merchant/users`
   - 用户激活：`PUT /merchant/users/activate`

2. **产品微服务** - `http://localhost:8080/product-ms/v1`
   - 添加商品：`POST /merchant/add`
   - 获取商品详情：`GET /merchant/product/{id}`
   - 上架商品：`POST /merchant/publish`
   - 下架商品：`POST /merchant/unpublish`
   - 更新库存：`POST /merchant/updateStock`

### 开发环境配置

在 `vite.config.ts` 中配置了API代理：

```typescript
server: {
  proxy: {
    '/user-ms': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    },
    '/product-ms': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

### 功能特性

1. **用户认证**
   - 商家登录/登出
   - Cookie-based 认证
   - 路由守卫保护

2. **产品管理**
   - 添加新产品
   - 上架/下架产品
   - 更新库存（仅限下架状态）
   - 产品图片URL支持

3. **用户体验**
   - 响应式设计
   - 友好的通知系统
   - 表单验证
   - 加载状态提示

### 启动后端服务

确保后端API服务运行在 `localhost:8080`，然后启动前端开发服务器：

```bash
npm run dev
```

访问 `http://localhost:5173` 开始使用应用。