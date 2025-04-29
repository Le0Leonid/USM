<template>
  <aside class="sidebar" :class="{ 'collapsed': isCollapsed }">
    <div class="sidebar-header">
      <div class="logo-container">
        <img src="@/assets/logo.svg" alt="Logo" class="logo" v-if="!isCollapsed">
        <img src="@/assets/logo-small.svg" alt="Logo" class="logo-small" v-else>
      </div>
      <button class="collapse-btn" @click="toggleCollapse">
        <i class="fas" :class="isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
      </button>
    </div>

    <nav class="sidebar-nav">
      <ul>
        <li>
          <router-link to="/" :class="{ 'active': currentRoute === '/' }">
            <font-awesome-icon icon="fa-tachometer-alt" />
            <span v-if="!isCollapsed">仪表盘</span>
          </router-link>
        </li>
        <li>
          <router-link to="/students" :class="{ 'active': currentRoute.includes('/students') }">
            <i class="fas fa-user-graduate"></i>
            <span v-if="!isCollapsed">学生管理</span>
          </router-link>
        </li>
        <li>
          <router-link to="/courses" :class="{ 'active': currentRoute.includes('/courses') }">
            <i class="fas fa-book"></i>
            <span v-if="!isCollapsed">课程管理</span>
          </router-link>
        </li>
        <li>
          <router-link to="/grades" :class="{ 'active': currentRoute.includes('/grades') }">
            <i class="fas fa-graduation-cap"></i>
            <span v-if="!isCollapsed">成绩管理</span>
          </router-link>
        </li>
        <li>
          <router-link to="/statistics" :class="{ 'active': currentRoute.includes('/statistics') }">
            <i class="fas fa-chart-bar"></i>
            <span v-if="!isCollapsed">统计分析</span>
          </router-link>
        </li>
        <li>
          <router-link to="/settings" :class="{ 'active': currentRoute.includes('/settings') }">
            <i class="fas fa-cog"></i>
            <span v-if="!isCollapsed">系统设置</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isCollapsed = ref(false);

const currentRoute = computed(() => route.path);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
  document.body.classList.toggle('sidebar-collapsed');
};
</script>

<style scoped>
.sidebar {
  background-color: #1e293b;
  width: 250px;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  color: #e2e8f0;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #2d3a4f;
  height: 64px;
}

.logo-container {
  overflow: hidden;
}

.logo {
  height: 32px;
}

.logo-small {
  height: 24px;
  width: 24px;
}

.collapse-btn {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

.collapse-btn:hover {
  background-color: #2d3a4f;
  color: white;
}

.sidebar-nav {
  padding: 1rem 0;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  margin-bottom: 0.25rem;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #94a3b8;
  text-decoration: none;
  transition: all 0.2s;
  border-radius: 0.25rem;
  margin: 0 0.5rem;
}

.sidebar.collapsed .sidebar-nav a {
  padding: 0.75rem;
  justify-content: center;
}

.sidebar-nav a:hover {
  background-color: #2d3a4f;
  color: white;
}

.sidebar-nav a.active {
  background-color: #3b82f6;
  color: white;
}

.sidebar-nav i {
  font-size: 1rem;
  width: 20px;
  margin-right: 0.75rem;
  text-align: center;
}

.sidebar.collapsed .sidebar-nav i {
  margin-right: 0;
}

.sidebar-nav span {
  white-space: nowrap;
}
</style>
