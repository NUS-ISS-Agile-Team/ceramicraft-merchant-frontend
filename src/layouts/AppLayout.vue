<template>
  <div class="app-layout">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="header-content">
        <div class="logo-section">
          <img src="/img/logo.png" alt="CERAMIC-CRAFT Logo" class="logo-image" />
          <span class="logo-text">CERAMIC-CRAFT</span>
        </div>

        <nav class="nav-menu">
          <router-link to="/" class="nav-item" active-class="active">Home</router-link>
          <router-link to="/products" class="nav-item" active-class="active">Products</router-link>
        </nav>

        <div class="user-section">
          <button @click="handleLogout" class="logout-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16,17 21,12 16,7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * 主应用布局组件
 */
import { useRouter } from 'vue-router'
import { AuthAPI } from '../services/auth'

const router = useRouter()

/**
 * 处理用户登出
 */
const handleLogout = async () => {
  try {
    await AuthAPI.logout()
    // 清除本地存储的token
    localStorage.removeItem('userToken')
    // 跳转到登录页面
    router.push('/auth/login')
  } catch (err) {
    console.error('Logout error:', err)
    // 即使API调用失败，也要清除本地token并跳转
    localStorage.removeItem('userToken')
    router.push('/auth/login')
  }
}
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  position: relative;
}

.app-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-image {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.logo-text {
  font-weight: 600;
  font-size: 20px;
  color: #1e293b;
  letter-spacing: 0.5px;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-item {
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  font-size: 16px;
  transition: color 0.2s;
  position: relative;
}

.nav-item:hover {
  color: #dc6643;
}

.nav-item.active {
  color: #dc6643;
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -21px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #dc6643;
}

.user-section {
  display: flex;
  align-items: center;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.main-content {
  flex: 1;
  width: 100%;
  background: #f8f9fb;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  min-height: 0;
}

@media (max-width: 768px) {
  .app-header {
    padding: 0 16px;
  }

  .header-content {
    height: 56px;
  }

  .nav-menu {
    gap: 16px;
  }

  .nav-item {
    font-size: 14px;
  }

  .logo-text {
    font-size: 18px;
  }
}

@media (max-width: 640px) {
  .nav-menu {
    display: none;
  }

  .logout-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>
