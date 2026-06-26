<template>
  <div class="error-page">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">Page Not Found</h2>
      <p class="error-desc">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <NuxtLink to="/" class="error-btn">← Back to Home</NuxtLink>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object
})
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f4ff;
  padding: 20px;
}

.error-content {
  text-align: center;
}

.error-code {
  font-size: 100px;
  font-weight: 800;
  color: #2563eb;
  margin-bottom: 0;
  line-height: 1;
}

.error-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
}

.error-desc {
  font-size: 15px;
  color: #64748b;
  margin-bottom: 30px;
  max-width: 400px;
}

.error-btn {
  display: inline-block;
  padding: 12px 30px;
  background: #2563eb;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;
}

.error-btn:hover {
  background: #1d4ed8;
}
</style>