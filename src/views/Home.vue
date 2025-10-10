<template>
  <!-- 首页内容 -->
  <div class="home">
    <div class="welcome-section">
      <h1>Welcome to CeramicCraft</h1>
      <p>Manage your ceramic products and inventory</p>
    </div>

    <div class="quick-actions">
      <h2>Quick Actions</h2>
      <div class="action-grid">
        <router-link to="/products" class="action-card">
          <div class="action-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <h3>Products Management</h3>
          <p>Manage your product inventory</p>
        </router-link>

        <router-link to="/orders" class="action-card">
          <div class="action-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/>
            </svg>
          </div>
          <h3>Order Management</h3>
          <p>Manage customer orders</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 首页组件
 * @description CeramicCraft 平台的客户端/商家端主页面
 */
</script>

<style scoped>
.home {
  width: 100%;
  padding: 40px 24px;
  background: #f8f9fb;
  min-height: 100vh;
  box-sizing: border-box;
}

.welcome-section {
  text-align: center;
  margin-bottom: 48px;
}

.welcome-section h1 {
  font-size: 32px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.welcome-section p {
  font-size: 16px;
  color: #64748b;
  margin: 0;
}

.quick-actions h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 24px 0;
  text-align: center;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;
}

.action-card {
  background: white;
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
  text-decoration: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  border: 1px solid transparent;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #dc6643;
}

.action-icon {
  color: #dc6643;
  margin-bottom: 16px;
}

.action-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.action-card p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

@media (max-width: 768px) {
  .home {
    padding: 24px 16px;
  }

  .welcome-section h1 {
    font-size: 28px;
  }

  .action-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
