import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'shop',
        name: 'Shop',
        component: () => import('../views/Home.vue'), // 临时使用Home组件
        meta: { requiresAuth: true }
      },
      {
        path: 'contact',
        name: 'Contact',
        component: () => import('../views/Home.vue'), // 临时使用Home组件
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('../views/Login.vue')
      }
    ]
  },
  // 重定向
  {
    path: '/login',
    redirect: '/auth/login'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, _from, next) => {
  // 如果访问的是根路径，重定向到登录页面
  if (to.path === '/') {
    next('/auth/login')
  } else {
    next()
  }
})

export default router
