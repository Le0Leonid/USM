<template>
  <header class="app-header">
    <div class="header-left">
      <button class="menu-toggle" @click="toggleSidebar">
        <i class="fas fa-bars"></i>
      </button>
      <h1 class="site-title">学籍管理系统</h1>
    </div>

    <div class="header-right">
      <div class="search-box">
        <input type="text" placeholder="搜索...">
        <button><i class="fas fa-search"></i></button>
      </div>

      <div class="user-menu" @click="toggleUserMenu">
        <img src="@/assets/avatar-placeholder.svg" alt="用户头像" class="avatar">
        <span class="username">管理员</span>
        <i class="fas fa-chevron-down"></i>

        <div class="dropdown-menu" v-if="showUserMenu">
          <a href="#"><i class="fas fa-user"></i> 个人信息</a>
          <a href="#"><i class="fas fa-cog"></i> 设置</a>
          <a href="#" @click.prevent="logout"><i class="fas fa-sign-out-alt"></i> 退出登录</a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const showUserMenu = ref(false);
const sidebarVisible = ref(true);

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
  document.body.classList.toggle('sidebar-collapsed');
};

const logout = () => {
  // 实现退出登录逻辑
  console.log('退出登录');
};
</script>

<style scoped>
.app-header {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 1.5rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-left, .header-right {
  display: flex;
  align-items: center;
}

.site-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  margin-left: 1rem;
}

.menu-toggle {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: #f3f4f6;
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  margin-right: 1.5rem;
}

.search-box input {
  border: none;
  background: none;
  padding: 0.5rem;
  width: 200px;
  outline: none;
}

.search-box button {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
}

.user-menu {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.username {
  font-weight: 500;
  margin-right: 0.5rem;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
  min-width: 200px;
  z-index: 100;
  margin-top: 0.5rem;
}

.dropdown-menu a {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #4b5563;
  text-decoration: none;
  font-size: 0.875rem;
}

.dropdown-menu a:hover {
  background-color: #f3f4f6;
}

.dropdown-menu i {
  margin-right: 0.5rem;
  width: 16px;
}
</style>
