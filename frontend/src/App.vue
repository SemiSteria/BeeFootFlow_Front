<script setup lang="ts">
import Navbar from './components/Layout/navbar.vue';
</script>

<template>
  <div class="app-container">
    <div class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <Navbar v-if="$route.path !== '/firstpage' && $route.path !== '/' && $route.path !== '/score'" />
  </div>
</template>

<style>
:root {
  --primary: #FAC12D;
  /* Golden Yellow */
  --primary-dark: #e5af29;
  --bg-color: #FFFFFF;
  --surface: #FFFFFF;
  --surface-alt: #F8F9FA;
  --text-main: #000000;
  --text-muted: #666666;
  --accent-glow: rgba(250, 191, 45, 0.2);
  --section-padding: 2rem;
  --container-max-width: 1200px;
}

@media (max-width: 768px) {
  :root {
    --section-padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  :root {
    --section-padding: 1rem;
  }
}

html,
body {
  margin: 0;
  padding: 0;
  background-color: #FFFFFF !important;
  color: #000000 !important;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background-color: #FFFFFF !important;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  /* padding-bottom removed as navbar is in flex column */
  background-color: #FFFFFF !important;
  scroll-behavior: smooth;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
