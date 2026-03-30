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

    <Navbar v-if="$route.path !== '/firstpage' && $route.path !== '/'" />
  </div>
</template>

<style>
:root {
  --primary: #FAC12D; /* Golden Yellow */
  --primary-dark: #e5af29;
  --bg-color: #FFFFFF;
  --surface: #FFFFFF;
  --surface-alt: #F8F9FA;
  --text-main: #000000;
  --text-muted: #666666;
  --accent-glow: rgba(250, 191, 45, 0.2);
}

html, body {
  margin: 0;
  padding: 0;
  background-color: #FFFFFF !important;
  color: #000000 !important;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
  padding-bottom: 2rem;
  background-color: #FFFFFF !important;
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
