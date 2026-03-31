<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const storedRaw = localStorage.getItem('user_data');
let storedUser = null;
try {
  storedUser = storedRaw ? JSON.parse(storedRaw) : null;
} catch {
  storedUser = null;
}

const user = ref({
  userName: storedUser?.pseudo ?? 'Guest',
  avatarUrl: storedUser?.avatar_url ?? null,
  totalMatchs: storedUser?.total_matches ?? 0,
  totalWins: storedUser?.total_wins ?? 0,
  elo: storedUser?.elo ?? 0
});

const userAccuracy = computed(() => {
  if (user.value.totalMatchs === 0) return 0;
  return Math.round((user.value.totalWins / user.value.totalMatchs) * 100);
});

onMounted(() => {
  // Sync logic if needed in the future
});
</script>

<template>
  <main class="score-view">

    <!-- HEADER -->
    <header class="score-header">
      <div class="brand-side">
        <h1>BEEFOOT<span>FLOW</span></h1>
      </div>

      <div class="user-summary" @click="router.push('/profile')">
        <div class="user-info-text">
          <span class="user-name">{{ user.userName }}</span>
          <span class="user-elo">{{ user.elo }} pts</span>
        </div>
        <div class="user-avatar-small">
          <img v-if="user.avatarUrl" :src="user.avatarUrl" :alt="user.userName" />
          <span v-else class="avatar-init">{{ user.userName.charAt(0).toUpperCase() }}</span>
        </div>
      </div>
    </header>

    <!-- STATS CARDS -->
    <div class="stats-container">
      <div class="stat-card">
        <div class="stat-info">
          <span class="stat-val">{{ user.totalMatchs }}</span>
          <span class="stat-lab">MATCHS</span>
        </div>
        <div class="stat-icon pulse">⚽</div>
      </div>

      <div class="stat-card">
        <div class="stat-info">
          <span class="stat-val">{{ user.totalWins.toString().padStart(2, '0') }}</span>
          <span class="stat-lab">WINS</span>
        </div>
        <div class="stat-icon">🏆</div>
      </div>

      <div class="stat-card">
        <div class="stat-info">
          <span class="stat-val">{{ userAccuracy }}%</span>
          <span class="stat-lab">ACC.</span>
        </div>
        <div class="stat-icon">🎯</div>
      </div>
    </div>

    <!-- QUICK ACTIONS -->
    <div class="quick-actions">
      <router-link :to="{ name: 'matchmaking-join' }" class="action-btn primary">
        <div class="action-icon">🤝</div>
        <span>REJOINDRE</span>
      </router-link>
      <router-link :to="{ name: 'matchmaking-find' }" class="action-btn dark">
        <div class="action-icon">⚡</div>
        <span>MATCHMAKING</span>
      </router-link>
    </div>

    <!-- RULES SECTION -->
    <section class="rules-kb-section">
      <div class="section-title">
        <h2>LES RÈGLES DE L'ART</h2>
        <span class="badge-volt">OFFICIEL FFFT</span>
      </div>

      <div class="rules-grid">
        <div class="kb-item">
          <div class="kb-header">
            <span class="kb-num">01</span>
            <h3>Manches & Points</h3>
          </div>
          <p>Match au meilleur des <strong>5 manches</strong>. Manche en <strong>5 points</strong>. Égalité à 4-4 ? Il
            faut 2 points d'écart.</p>
        </div>

        <div class="kb-item">
          <div class="kb-header">
            <span class="kb-num">02</span>
            <h3>L'engagement</h3>
          </div>
          <p>Toujours aux <strong>demis</strong>. Demandez <strong>« Prêt ? »</strong>. La balle doit être arrêtée avant
            de démarrer.</p>
        </div>

        <div class="kb-item">
          <div class="kb-header">
            <span class="kb-num">03</span>
            <h3>Autorisé</h3>
          </div>
          <p>La <strong>pissette</strong> est 100% autorisée. Les buts marqués avec les <strong>demis</strong> comptent
            aussi.</p>
        </div>

        <div class="kb-item">
          <div class="kb-header">
            <span class="kb-num">04</span>
            <h3>Interdit</h3>
          </div>
          <p>La <strong>roulette</strong> est interdite (> 360°). Pas de vibrations ou de gêne physique.</p>
        </div>
      </div>
    </section>

  </main>
</template>

<style scoped>
.score-view {
  max-width: 900px;
  margin: auto;
  padding: 2rem 1rem;
  color: var(--text-main);
}

/* HEADER */
.score-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  background: white;
  padding: 1.25rem 1.5rem;
  border-radius: 24px;
  border: 1px solid #EDEDED;
}

.score-header h1 {
  font-size: 1.4rem;
  font-weight: 950;
  letter-spacing: -1px;
  margin: 0;
}

.score-header h1 span {
  color: var(--primary);
}

.user-summary {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  padding-left: 1rem;
  border-left: 2px solid #F8F9FA;
  transition: opacity 0.2s ease;
}

.user-summary:hover {
  opacity: 0.8;
}

.user-info-text {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-name {
  font-size: 0.95rem;
  font-weight: 900;
  color: #000;
}

.user-elo {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--primary);
}

.user-avatar-small {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  border: 2px solid #F8F9FA;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFF8E1;
}

.user-avatar-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-init {
  font-weight: 900;
  color: var(--primary);
}

/* STATS CARDS */
.stats-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem 1rem;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid #EDEDED;
  color: #000;
}

.stat-val {
  font-size: 1.6rem;
  font-weight: 950;
}

.stat-lab {
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--primary);
  letter-spacing: 1.5px;
}

.stat-icon {
  font-size: 1.3rem;
  background: #F8F9FA;
  padding: 0.5rem;
  border-radius: 12px;
}

.pulse {
  animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

/* QUICK ACTIONS */
.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 3.5rem;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 1.5rem;
  border-radius: 24px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn.primary {
  background: var(--primary);
  color: #000;
  box-shadow: 0 10px 20px rgba(250, 193, 45, 0.2);
}

.action-btn.dark {
  background: #1A1D23;
  color: white;
}

.action-btn:hover {
  transform: translateY(-5px);
  filter: brightness(1.1);
}

.action-icon {
  font-size: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.action-btn span {
  font-size: 0.8rem;
  font-weight: 900;
  letter-spacing: 1px;
}

/* RULES SECTION */
.rules-kb-section {
  padding-bottom: 3rem;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title h2 {
  font-size: 0.85rem;
  font-weight: 900;
  letter-spacing: 2px;
  color: #000;
}

.badge-volt {
  font-size: 0.65rem;
  background: var(--primary);
  color: #000;
  padding: 0.3rem 0.8rem;
  border-radius: 30px;
  font-weight: 950;
}

.rules-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.kb-item {
  background: white;
  padding: 1.5rem;
  border-radius: 20px;
  border: 1px solid #EDEDED;
  color: #000;
}

.kb-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.kb-num {
  font-size: 0.7rem;
  font-weight: 950;
  color: var(--primary);
  background: #F8F9FA;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.kb-header h3 {
  font-size: 0.95rem;
  margin: 0;
  font-weight: 900;
}

.kb-item p {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 900px) {
  .score-view {
    padding: var(--section-padding);
  }
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .stat-card:last-child {
    grid-column: span 2;
  }

  .quick-actions {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .rules-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .stats-container {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .stat-card:last-child {
    grid-column: auto;
  }

  .score-header {
    padding: 1.25rem 1rem;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    text-align: center;
  }

  .user-summary {
    border-left: none;
    border-top: 1px solid #EDEDED;
    padding-left: 0;
    padding-top: 1.25rem;
    width: 100%;
    justify-content: center;
  }

  .user-info-text {
    align-items: center;
  }

  .score-header h1 {
    font-size: 1.2rem;
  }

  .stat-val {
    font-size: 1.4rem;
  }

  .section-title h2 {
    font-size: 0.75rem;
  }
}
</style>
