<script setup lang="ts">
import { onMounted, ref } from 'vue';

const isPWAEnabled = ref(false);

onMounted(() => {
  // Check if PWA plugin is working
  if ('serviceWorker' in navigator) {
    isPWAEnabled.value = true;
  }
});

const handleInstall = async () => {
    // This is just a placeholder to show the potential.
    // In a real application, you would capture the 'beforeinstallprompt' event.
    console.log('PWA installation triggered');
};
</script>

<template>
  <div class="container">
    <main class="card">
      <header>
        <div class="logo">🐝</div>
        <h1>BeeFootFlow</h1>
      </header>
      
      <p>
        The ultimate dashboard for your activities. Synchronized, fast, and 
        <span class="highlight">Offline Ready</span>. 
        Experience the next generation of web apps.
      </p>

      <div class="actions">
        <button class="btn-primary" @click="handleInstall">
          <span>Get Started</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      </div>

      <div class="features">
        <div class="feature-item">
          <h3>⚡️ Fast</h3>
          <p>Instant loading with service workers.</p>
        </div>
        <div class="feature-item">
          <h3>📦 PWA</h3>
          <p>Installable on any device.</p>
        </div>
        <div class="feature-item">
          <h3>🎨 Premium</h3>
          <p>Carefully crafted design and animations.</p>
        </div>
      </div>
    </main>

    <div v-if="isPWAEnabled" class="pwa-status">
      <div class="status-dot"></div>
      PWA Ready
    </div>
  </div>
</template>

<style scoped>
.logo {
  font-size: 3rem;
  margin-bottom: 1rem;
}

header {
  margin-bottom: 2rem;
}

.highlight {
  color: var(--primary);
  font-weight: 600;
}

.actions {
  margin-top: 2rem;
  margin-bottom: 3rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  border-top: 1px solid var(--glass-border);
  padding-top: 3rem;
}

.feature-item h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #fbbf24;
}

.feature-item p {
  font-size: 1rem;
  margin-bottom: 0;
}

.status-dot {
  width: 8px;
  height: 8px;
  background-color: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 10px #22c55e;
}

@media (max-width: 640px) {
  h1 { font-size: 2.5rem; }
  .card { padding: 2rem; }
}
</style>
