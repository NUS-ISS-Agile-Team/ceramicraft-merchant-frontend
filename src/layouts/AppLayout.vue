<template>
  <div class="app-layout">
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * 主应用布局组件
 */
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
