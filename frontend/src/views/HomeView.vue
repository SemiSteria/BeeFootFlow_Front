<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

const matchTime = ref(0);
const timeSinceLastGoal = ref(45);
const ballSpeed = ref(12.5);

const redTeam = {
  name: "Rouge",
  score: 4,
  avgMmr: 1450,
  players: [
    { name: "Alexandre", mmr: 1500 },
    { name: "Marie", mmr: 1400 }
  ]
};

const blueTeam = {
  name: "Bleue",
  score: 3,
  avgMmr: 1420,
  players: [
    { name: "Julien", mmr: 1480 },
    { name: "Sophie", mmr: 1360 }
  ]
};

const isLeading = computed(() =>
  redTeam.score > blueTeam.score ? 'red' :
  blueTeam.score > redTeam.score ? 'blue' : 'tie'
);

let timerInterval: ReturnType<typeof setInterval>;

onMounted(() => {
  timerInterval = setInterval(() => matchTime.value++, 1000);
});

onUnmounted(() => clearInterval(timerInterval));

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};
</script>

<template>
  <main class="score-view">

    <!-- HEADER -->
    <header class="score-header">
      <h1>BEEFOOT<span>FLOW</span></h1>
      <div class="live">LIVE</div>
    </header>

    <div class="stats-container">
      <div class="stat-card">
        <div class="stat-info">
          <!-- Mapping with Prisma 'totalMatchs' field -->
          <span class="stat-val">{{ user.totalMatchs }}</span>
          <span class="stat-lab">MATCHS</span>
        </div>
        <div class="stat-icon pulse">⚽</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-info">
          <!-- Mapping with Prisma 'totalWins' field -->
          <span class="stat-val">{{ user.totalWins.toString().padStart(2, '0') }}</span>
          <span class="stat-lab">WINS</span>
        </div>
        <div class="stat-icon">🏆</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-info">
          <!-- Dynamic accuracy calculation without storing the variable -->
          <span class="stat-val">
            {{ user.totalMatchs > 0 ? Math.round((user.totalWins / user.totalMatchs) * 100) : 0 }}%
          </span>
          <span class="stat-lab">ACC.</span>
        </div>
      </div>
    </div>

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

    <section class="next-match-section">
      <div class="section-title">
        <h2>NEXT MATCH</h2>
        <span class="live-indicator">LIVE SOON</span>
      </div>
      
      <div class="match-glass-card">
        <div class="team-side">
          <div class="team-logo">A</div>
          <span>Team Alpha</span>
        </div>
        <div class="match-center">
          <span class="vs-text">VS</span>
          <div class="match-time">19:00</div>
        </div>
        <div class="team-side">
          <div class="team-logo b">B</div>
          <span>Team Bravo</span>
    <!-- SCORE -->
    <section class="scoreboard">

      <!-- BLUE -->
      <div class="team blue">
        <span class="team-name">BLEU</span>
        <div class="score">{{ blueTeam.score }}</div>

        <div class="players">
          <div v-for="p in blueTeam.players" :key="p.name">
            <span>{{ p.name }}</span>
            <span class="mmr">{{ p.mmr }}</span>
          </div>
        </div>
      </div>

      <!-- CENTER -->
      <div class="center">
        <div class="timer">{{ formatTime(matchTime) }}</div>
        <div class="vs">VS</div>
      </div>

      <!-- RED -->
      <div class="team red">
        <span class="team-name">ROUGE</span>
        <div class="score">{{ redTeam.score }}</div>

        <div class="players">
          <div v-for="p in redTeam.players" :key="p.name">
            <span>{{ p.name }}</span>
            <span class="mmr">{{ p.mmr }}</span>
          </div>
        </div>
      </div>

    </section>

    <!-- STATS -->
    <section class="stats">
      <div>
        <span>DERNIER BUT</span>
        <strong>{{ formatTime(timeSinceLastGoal) }}</strong>
      </div>

      <div class="highlight">
        <span>VITESSE</span>
        <strong>{{ ballSpeed }} KM/H</strong>
      </div>

      <div>
        <span>MÈNE</span>
        <strong :class="isLeading">
          {{ isLeading === 'red' ? 'ROUGE' : isLeading === 'blue' ? 'BLEU' : 'ÉGALITÉ' }}
        </strong>
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
  margin-bottom: 2rem;
}

.score-header h1 {
  font-weight: 950;
  letter-spacing: -1px;
}

.score-header span {
  color: var(--primary);
}

.live {
  background: black;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 900;
}

/* SCOREBOARD */
.scoreboard {
  display: grid;
  grid-template-columns: 1fr 120px 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

/* TEAM */
.team {
  background: white;
  border-radius: 24px;
  padding: 1.5rem;
  border: 1px solid #eee;
  text-align: center;
}

.team-name {
  font-size: 0.7rem;
  letter-spacing: 2px;
  font-weight: 900;
}

.score {
  font-size: 4rem;
  font-weight: 950;
  margin: 1rem 0;
}

.blue .score {
  color: #00bcd4;
}

.red .score {
  color: #ff2a55;
}

/* PLAYERS */
.players {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.players div {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.mmr {
  color: var(--primary);
  font-weight: 700;
}

/* CENTER */
.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.timer {
  font-weight: 900;
  color: var(--primary);
}

.vs {
  font-size: 1.5rem;
  font-weight: 900;
  color: #ccc;
}

/* STATS */
.stats {
  display: flex;
  justify-content: space-between;
  background: white;
  padding: 1rem;
  border-radius: 20px;
  border: 1px solid #eee;
}

.stats div {
  text-align: center;
  flex: 1;
}

.stats span {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.stats strong {
  display: block;
  font-size: 1.2rem;
  margin-top: 0.3rem;
}

.highlight {
  color: var(--primary);
}

/* RESPONSIVE */
@media (max-width: 700px) {
  .scoreboard {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .center {
    flex-direction: row;
    justify-content: center;
  }

  .stats {
    flex-direction: column;
    gap: 1rem;
  }
}

/* Quick Actions */
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
  border: 1px solid transparent;
}

.action-btn.primary {
  background: var(--primary);
  color: #000;
  box-shadow: 0 10px 20px var(--accent-glow);
}

.action-btn.dark {
  background: #1A1D23;
  color: white;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
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

.action-btn.dark .action-icon {
  background: rgba(255, 255, 255, 0.1);
}

.action-btn span {
  font-size: 0.8rem;
  font-weight: 900;
  letter-spacing: 1px;
}
</style>
