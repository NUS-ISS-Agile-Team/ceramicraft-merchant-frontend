# readme
src/
├── assets/                # 图片、logo等静态资源
├── components/            # 通用组件（如导航栏、商品卡片、分页等）
├── views/                 # 页面级组件（如首页、商品列表、商品详情、登录、注册、购物车等）
│   ├── Home.vue
│   ├── Shop.vue
│   ├── ProductDetail.vue
│   ├── Login.vue
│   ├── Register.vue
│   ├── Cart.vue
│   └── Contact.vue
├── router/                # 路由配置
│   └── index.ts
├── store/                 # 状态管理（如 pinia，存放用户、购物车、商品等全局状态）
│   └── index.ts
├── api/                   # axios 封装及接口请求文件
│   └── product.ts
│   └── user.ts
├── layouts/               # 页面布局（如主布局、登录布局等）
│   └── MainLayout.vue
│   └── AuthLayout.vue
├── utils/                 # 工具函数
├── types/                 # TypeScript 类型定义
├── App.vue                # 根组件
├── main.ts                # 入口文件
└── style.css              # 全局样式