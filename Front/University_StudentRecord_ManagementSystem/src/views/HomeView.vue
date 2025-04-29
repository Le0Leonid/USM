<template>
  <div class="home">
    <div class="welcome-section">
      <h1>欢迎使用学籍管理系统</h1>
      <p>高效管理学生信息、课程和成绩的综合平台</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <font-awesome-icon icon="fa-user-graduate" />
        </div>
        <div class="stat-content">
          <h3>学生总数</h3>
          <p class="stat-number">2,543</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <font-awesome-icon icon="fa-book" />
        </div>
        <div class="stat-content">
          <h3>课程总数</h3>
          <p class="stat-number">165</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <font-awesome-icon icon="fa-graduation-cap" />
        </div>
        <div class="stat-content">
          <h3>平均成绩</h3>
          <p class="stat-number">82.5</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <font-awesome-icon icon="fa-chart-bar" />
        </div>
        <div class="stat-content">
          <h3>通过率</h3>
          <p class="stat-number">94%</p>
        </div>
      </div>
    </div>

    <div class="quick-actions">
      <h2>快速操作</h2>
      <div class="action-buttons">
        <router-link to="/students" class="action-button">
          <font-awesome-icon icon="fa-user-graduate" />
          <span>管理学生</span>
        </router-link>
        <router-link to="/courses" class="action-button">
          <font-awesome-icon icon="fa-book" />
          <span>管理课程</span>
        </router-link>
        <router-link to="/grades" class="action-button">
          <font-awesome-icon icon="fa-graduation-cap" />
          <span>管理成绩</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  margin-bottom: 2rem;
}

.welcome-section h1 {
  color: #1f2937;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.welcome-section p {
  color: #6b7280;
  font-size: 1.125rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  display: flex;
  align-items: center;
}

.stat-icon {
  font-size: 2rem;
  color: #3b82f6;
  background-color: #eff6ff;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.stat-content {
  flex-grow: 1;
}

.stat-content h3 {
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 0.25rem 0;
  font-weight: 500;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.quick-actions {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.quick-actions h2 {
  font-size: 1.25rem;
  color: #1f2937;
  margin-top: 0;
  margin-bottom: 1rem;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 6px;
  text-decoration: none;
  color: #4b5563;
  transition: all 0.3s;
}

.action-button:hover {
  background-color: #eff6ff;
  color: #3b82f6;
  transform: translateY(-2px);
}

.action-button i {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
