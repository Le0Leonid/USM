<template>
  <div class="app-container">
    <!-- 侧边栏 -->
    <Sidebar />

    <div class="main-content">
      <!-- 顶部导航栏 -->
      <AppHeader />

      <!-- 主要内容区域 -->
      <main>
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>

      <!-- 页脚 -->
      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppHeader from '@/components/common/AppHeader.vue';
import AppFooter from '@/components/common/AppFooter.vue';
import Sidebar from '@/components/common/Sidebar.vue';
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

main {
  flex-grow: 1;
  padding: 1.5rem;
  background-color: #f9fafb;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
