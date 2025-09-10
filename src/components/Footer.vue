<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-links">
        <a href="#">Search</a>
        <a href="#">Store Policy</a>
        <a href="#">Shipping & Returns</a>
      </div>
      <div class="footer-dropdowns">
        <select class="footer-select">
          <option>English</option>
          <option>中文</option>
        </select>
        <select class="footer-select">
          <option>Singapore (SGD $)</option>
          <option>USD ($)</option>
        </select>
      </div>
      <div class="footer-social">
        <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
        <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
        <a href="#" class="social-icon"><i class="fab fa-youtube"></i></a>
      </div>
    </div>
  </footer>
  
  <!-- 浮动 cookie 提示 -->
  <div class="cookie-notice-popup" v-if="showCookieNotice">
    <div class="cookie-content">
      <div class="cookie-text">
        Our site uses cookies. Learn more about our use of cookies: 
        <router-link to="/cookie-policy" class="cookie-link">cookie policy</router-link>
      </div>
      <button class="cookie-button" @click="acceptCookies">I Accept</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const showCookieNotice = ref(false)

onMounted(() => {
  // 检查是否已接受 cookies
  const cookiesAccepted = localStorage.getItem('cookiesAccepted') === 'true'
  showCookieNotice.value = !cookiesAccepted

  // 页面加载时，如果需要显示 cookie 提示，延迟 1 秒后显示，提升用户体验
  if (!cookiesAccepted) {
    setTimeout(() => {
      showCookieNotice.value = true
    }, 1000)
  }
})

function acceptCookies() {
  localStorage.setItem('cookiesAccepted', 'true')
  showCookieNotice.value = false
}
</script>

<style scoped>
.footer {
  background: #222;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 0;
  font-size: 14px;
  margin-top: 0;
  flex-shrink: 0; /* 防止页脚被压缩 */
  position: relative; /* 确保页脚始终在文档流中 */
  z-index: 1; /* 提高层级，确保可见 */
}

.footer-content {
  display: flex;
  width: 100%;
  max-width: 1200px;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-links a {
  color: #fff;
  text-decoration: none;
}

.footer-dropdowns {
  display: flex;
  gap: 10px;
}

.footer-select {
  background-color: #222;
  color: #fff;
  border: 1px solid #444;
  padding: 5px 10px;
  border-radius: 2px;
}

.footer-social {
  display: flex;
  gap: 15px;
}

.social-icon {
  color: #fff;
  font-size: 16px;
}

.cookie-notice-popup {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.cookie-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 20px;
}

.cookie-text {
  font-size: 13px;
  color: #fff;
}

.cookie-link {
  color: #fff;
  text-decoration: underline;
}

.cookie-button {
  background: #c75d35;
  color: white;
  border: none;
  padding: 8px 20px;
  margin-left: 20px;
  border-radius: 2px;
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;
  transition: background-color 0.3s;
}

.cookie-button:hover {
  background-color: #d26b42;
}
</style>
