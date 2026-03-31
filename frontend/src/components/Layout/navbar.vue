<template>
  <nav class="bottom-nav" :style="{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }">
    <button class="nav-item" :class="{ active: $route.path === '/home' }" @click="$router.push('/home')">
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      </svg>
      <span class="nav-label">ACCUEIL</span>
    </button>

    <button class="nav-item" :class="{ active: $route.path === '/matchmaking' }" @click="$router.push('/matchmaking')">
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 3L3 6V21L9 18L15 21L21 18V3L15 6L9 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
        <line x1="9" y1="3" x2="9" y2="18" stroke="currentColor" stroke-width="2"/>
        <line x1="15" y1="6" x2="15" y2="21" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span class="nav-label">Matchmaking</span>
    </button>

    <button class="nav-item" :class="{ active: $route.path === '/profile' }" @click="$router.push('/profile')">
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="nav-label">PROFILE</span>
    </button>
  </nav>
</template>

<style scoped>
.bottom-nav {
  flex-shrink: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid #EDEDED;
  padding: 0.8rem 1rem;
  padding-bottom: calc(0.8rem + env(safe-area-inset-bottom, 0px));
  height: auto;
  position: relative;
  z-index: 100;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.03);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #94A3B8;
  transition: all 0.25s ease;
  padding: 0.6rem 1.2rem;
  font-family: inherit;
  border-radius: 12px;
}

.nav-item.active {
  color: var(--text-main);
  background: var(--surface-alt);
}

.nav-item:hover:not(.active) {
  color: var(--primary);
  transform: translateY(-2px);
}

.nav-item.active .nav-icon {
  color: var(--primary);
}

.nav-icon {
  width: 24px;
  height: 24px;
}

.nav-label {
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
@media (max-width: 480px) {
  .nav-item {
    padding: 0.6rem 0.8rem;
    gap: 0.3rem;
  }
}
</style>