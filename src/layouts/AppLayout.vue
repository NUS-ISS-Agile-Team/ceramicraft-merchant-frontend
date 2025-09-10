<template>
  <div class="app-layout">
    <!-- 主应用布局，包含头部和底部 -->
    <Header />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
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

.main-content {
  flex: 1;
  width: 100%;
  background: #fff;
  display: flex;
  margin: 0;
  padding: 0;
  min-height: 0;
}
</style>
