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
</style>