<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-left">
        <p class="copyright">&copy; {{ currentYear }} 学籍管理系统. 保留所有权利.</p>
      </div>
      <div class="footer-right">
        <a href="#" class="footer-link">帮助文档</a>
        <a href="#" class="footer-link">关于我们</a>
        <a href="#" class="footer-link">联系支持</a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.app-footer {
  background-color: #ffffff;
  border-top: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  margin: 0;
}

.footer-right {
  display: flex;
  gap: 1.5rem;
}

.footer-link {
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #3b82f6;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
