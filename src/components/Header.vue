<template>
  <header class="header">
    <div class="header-content">
      <div class="logo">
        <div class="logo-image">
          <img src="/img/logo.png" alt="CERAMIC-CRAFT Logo" />
        </div>
        <span>CERAMIC-CRAFT</span>
      </div>
      <nav class="nav">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/shop" class="nav-link">Shop</router-link>
        <router-link to="/contact" class="nav-link">Contact</router-link>
      </nav>
      <div class="actions">
        <el-icon class="action-icon"><User /></el-icon>
        <el-icon class="action-icon"><Search /></el-icon>
        <div class="cart-icon">
          <el-icon class="action-icon"><ShoppingCart /></el-icon>
          <span class="cart-count">0</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { User, Search, ShoppingCart } from '@element-plus/icons-vue'
</script>

<style scoped>
.header {
  display: flex;
  justify-content: center;
  height: 70px;
  border-bottom: 1px solid #eee;
  background: #fff;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  padding: 0;
  margin: 0 15px; /* 减小两侧间距 */
  position: relative; /* 添加相对定位，作为导航的定位参考 */
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 180px; /* 设置最小宽度，与右侧操作区域保持平衡 */
}

.logo-image {
  width: 40px;
  height: 40px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo span {
  font-weight: 600;
  font-size: 20px;
  letter-spacing: 0.5px;
}

.nav {
  display: flex;
  gap: 40px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s;
}

.nav-link:hover, .nav-link.router-link-active {
  color: #c75d35;
}

.actions {
  display: flex;
  align-items: center;
  gap: 24px;
  height: 100%; /* 确保高度一致 */
  min-width: 180px; /* 设置最小宽度，与左侧logo区域保持平衡 */
  justify-content: flex-end; /* 确保右对齐 */
}

.action-icon {
  font-size: 20px;
  cursor: pointer;
  color: #333;
  display: flex; /* 使用flex布局确保图标垂直居中 */
  align-items: center;
  justify-content: center;
  height: 24px; /* 固定高度 */
}

.cart-icon {
  position: relative;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #c75d35;
  color: white;
  font-size: 10px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
