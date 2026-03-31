<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TabMenu from '../components/TabMenu.vue';

const router = useRouter();
const route = useRoute();

// Convert route name to tab ID
const getTabFromRoute = () => {
  if (route.name === 'matchmaking-join') return 'join';
  return 'matchmaking';
};

const activeTab = ref(getTabFromRoute());

const tabs = [
  { id: 'matchmaking', label: 'Matchmaking' },
  { id: 'join', label: 'Rejoindre' }
];

// Navigate when tab changes
watch(activeTab, (newTab) => {
  if (newTab === 'join') {
    router.push({ name: 'matchmaking-join' });
  } else {
    router.push({ name: 'matchmaking-find' });
  }
});

// Update active tab when route changes (e.g. back button)
watch(() => route.name, () => {
  activeTab.value = getTabFromRoute();
});

const goBack = () => {
  router.push('/home');
};
</script>

<template>
  <main class="matchmaking-page">
    <header class="page-header">
      <button @click="goBack" class="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <div class="header-text">
        <h1>Le Flow</h1>
        <p>Trouvez votre prochain adversaire.</p>
      </div>
    </header>

    <div class="content-wrapper">
      <TabMenu v-model="activeTab" :tabs="tabs" />

      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </main>
</template>

<style scoped>
.matchmaking-page {
  margin-top: 2rem;
  min-height: 100vh;
  background-color: #FFFFFF;
  padding: 1.5rem;
  padding-top: env(safe-area-inset-top, 1.5rem);
}

.page-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.back-btn {
  background: #F8F9FA;
  border: 1px solid #EDEDED;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #000;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #FFFFFF;
  border-color: #FAC12D;
  transform: translateX(-3px);
}

.header-text h1 {
  font-size: 1.6rem;
  font-weight: 950;
  letter-spacing: -1.5px;
  margin: 0;
  text-transform: uppercase;
  line-height: 1;
}

.header-text p {
  font-size: 0.8rem;
  font-weight: 600;
  color: #666;
  margin: 0.3rem 0 0;
}

.content-wrapper {
  max-width: 500px;
  margin: 0 auto;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

@media (max-width: 480px) {
  .matchmaking-page {
    padding: var(--section-padding);
  }

  .page-header {
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .header-text h1 {
    font-size: 1.4rem;
  }

  .back-btn {
    width: 40px;
    height: 40px;
  }
}
</style>
