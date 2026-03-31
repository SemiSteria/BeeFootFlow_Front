<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import MatchmakingPage from './components/pages/matchmaking.vue'

const currentPath = ref(window.location.pathname)

function syncPath() {
  currentPath.value = window.location.pathname
}

const isTemporaryMatchmakingRoute = computed(
  () => currentPath.value === '/matchmaking-temp',
)

onMounted(() => {
  window.addEventListener('popstate', syncPath)
})

onBeforeUnmount(() => {
  window.removeEventListener('popstate', syncPath)
})
</script>

<template>
  <MatchmakingPage v-if="isTemporaryMatchmakingRoute" />

  <main
    v-else
    class="temporary-home"
  >
    <div class="home-card">
      <p class="eyebrow">Route temporaire</p>
      <h1>BeeFootFlow Front</h1>
      <p>
        La page matchmaking est disponible ici pour le développement front.
      </p>
      <a
        class="home-link"
        href="/matchmaking-temp"
      >
        Ouvrir `/matchmaking-temp`
      </a>
    </div>
  </main>
</template>

<style scoped>
.temporary-home {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.home-card {
  max-width: 560px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(15, 23, 42, 0.72);
  padding: 32px;
  color: #f8fafc;
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.28);
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #fbbf24;
}

h1 {
  margin: 0 0 12px;
  font-size: 2.2rem;
}

p {
  margin: 0 0 20px;
  color: #cbd5e1;
}

.home-link {
  display: inline-flex;
  align-items: center;
  border-radius: 14px;
  padding: 12px 16px;
  background: #fbbf24;
  color: #111827;
  font-weight: 800;
  text-decoration: none;
}
</style>
