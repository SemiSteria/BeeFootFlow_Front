<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const API_URL = 'http://localhost:3000';
const isFullscreen = ref(false);

const toggleFullscreen = async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen().catch(err => {
      console.warn("Error attempting to enable fullscreen:", err);
    });
  } else {
    await document.exitFullscreen();
  }
};

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

const matchTime = ref(0);
const timeSinceLastGoal = ref(45);
const ballSpeed = ref(12.5);

const redTeam = ref({
  name: "Rouge",
  score: 0,
  avgMmr: 0,
  players: [
    { name: "Alexandre", mmr: 1500 },
    { name: "Marie", mmr: 1400 }
  ]
});

const blueTeam = ref({
  name: "Bleue",
  score: 0,
  avgMmr: 0,
  players: [
    { name: "Julien", mmr: 1480 },
    { name: "Sophie", mmr: 1360 }
  ]
});

const isLeading = computed(() => redTeam.value.score > blueTeam.value.score ? 'red' : blueTeam.value.score > redTeam.value.score ? 'blue' : 'tie');

let timerInterval: ReturnType<typeof setInterval>;
let goalTimerInterval: ReturnType<typeof setInterval>;
let speedInterval: ReturnType<typeof setInterval>;

onMounted(async () => {
  const matchId = "6d38af12-521c-46f7-b193-f9b8e7b59223";

  let stored: Record<string, any> = {};

  if (matchId) {
    try {
      const res = await fetch(`${API_URL}/matchesScore/${matchId}`);
      if (res.ok) {
        stored = await res.json();
        localStorage.setItem('matches_data', JSON.stringify(stored));
      }
    } catch (err) {
      console.warn('Failed to fetch match data:', err);
    }
  }

  if (!stored.score_team_a && !stored.score_team_b) {
    stored = JSON.parse(localStorage.getItem('matches_data') ?? '{}');
  }

  console.log('Loaded match data:', stored);
  redTeam.value.score = stored.match.score_team_a ?? 0;
  blueTeam.value.score = stored.match.score_team_b ?? 0;
  redTeam.value.avgMmr = stored.match.avg_elo ?? 0;
  blueTeam.value.avgMmr = stored.match.avg_elo ?? 0;

  timerInterval = setInterval(() => { matchTime.value++; }, 1000);
  goalTimerInterval = setInterval(() => { timeSinceLastGoal.value++; }, 1000);
  speedInterval = setInterval(() => {
    ballSpeed.value = Number((Math.random() * 20 + 5).toFixed(1));
  }, 2000);
  document.addEventListener('fullscreenchange', handleFullscreenChange);
});

onUnmounted(() => {
  clearInterval(timerInterval);
  clearInterval(goalTimerInterval);
  clearInterval(speedInterval);
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
});

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};
</script>

<template>
  <main class="arena" :class="{ 'is-fullscreen': isFullscreen }">

    <!-- Top bar -->
    <header class="topbar">
      <div class="topbar-left">
        <span class="logo-mark">⬡</span>
        <span class="brand">BEEFOOT<em>FLOW</em></span>
      </div>
      <div class="live-chip">
        <span class="live-dot"></span>
        LIVE MATCH
      </div>
      <div class="topbar-right">
        <button class="fullscreen-btn" @click="toggleFullscreen" title="Plein écran">
          ⛶
        </button>
      </div>
    </header>

    <!-- Main scoreboard split -->
    <section class="split-view">
      
      <!-- BLUE SIDE -->
      <div class="team-panel blue-panel">
        <div class="panel-content">
          <h2 class="team-name">ÉQUIPE BLEUE</h2>
          <div class="big-score">{{ blueTeam.score }}</div>
          
          <div class="team-stats">
            <div class="stat-pill">MMR MOYEN: {{ blueTeam.avgMmr }}</div>
          </div>
          
          <div class="player-roster">
            <div class="player-card" v-for="p in blueTeam.players" :key="p.name">
              <span class="p-name">{{ p.name }}</span>
              <span class="p-mmr">{{ p.mmr }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- RED SIDE -->
      <div class="team-panel red-panel">
        <div class="panel-content">
          <h2 class="team-name">ÉQUIPE ROUGE</h2>
          <div class="big-score">{{ redTeam.score }}</div>
          
          <div class="team-stats">
            <div class="stat-pill">MMR MOYEN: {{ redTeam.avgMmr }}</div>
          </div>
          
          <div class="player-roster">
            <div class="player-card" v-for="p in redTeam.players" :key="p.name">
              <span class="p-name">{{ p.name }}</span>
              <span class="p-mmr">{{ p.mmr }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- CENTER OVERLAY -->
      <div class="center-hud">
        <div class="hud-top">
          <span class="hud-label">CHRONO</span>
          <span class="hud-time">{{ formatTime(matchTime) }}</span>
        </div>
        
        <div class="hud-vs">VS</div>
        
        <div class="hud-bottom">
          <div class="hud-box">
            <span class="hud-label">DERNIER BUT</span>
            <span class="hud-val">{{ formatTime(timeSinceLastGoal) }}</span>
          </div>
          <div class="hud-divider"></div>
          <div class="hud-box highlight">
            <span class="hud-label">VITESSE</span>
            <span class="hud-val">{{ ballSpeed }} <small>KM/H</small></span>
          </div>
        </div>
      </div>

    </section>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;700;900&display=swap');

:root {
  --blue-vivid: #007BFF;
  --blue-bright: #3395FF;
  --red-vivid: #FF2A55;
  --red-bright: #FF5A7C;
  --yellow-vivid: #FAC12D;
  --yellow-glow: rgba(250, 193, 45, 0.5);
  --dark-bg: #070707;
}

* {
  box-sizing: border-box;
}

.arena {
  min-height: 100vh;
  background-color: #070707;
  color: #fff;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
}

/* TOPBAR */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #000;
  border-bottom: 4px solid var(--yellow-vivid);
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-mark {
  font-size: 1.5rem;
  color: var(--yellow-vivid);
}

.brand {
  font-family: 'Anton', sans-serif;
  font-size: 1.5rem;
  letter-spacing: 1px;
}

.brand em {
  font-style: normal;
  color: var(--yellow-vivid);
}

.live-chip {
  background: var(--red-vivid);
  color: #fff;
  font-weight: 900;
  font-size: 0.8rem;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  letter-spacing: 1px;
  box-shadow: 0 0 15px rgba(255, 42, 85, 0.4);
}

.live-dot {
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  animation: pulse 1s infinite alternate;
}

@keyframes pulse {
  0% { opacity: 0.2; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1.2); }
}

.fullscreen-btn {
  background: none;
  border: 2px solid var(--yellow-vivid);
  color: var(--yellow-vivid);
  border-radius: 8px;
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.fullscreen-btn:hover {
  background: var(--yellow-vivid);
  color: #000;
  box-shadow: 0 0 15px var(--yellow-glow);
}

/* SPLIT VIEW */
.split-view {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
}

.team-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 2rem;
}

/* Colorful backgrounds */
.blue-panel {
  background: linear-gradient(135deg, #001f4d 0%, var(--blue-vivid) 100%);
  border-right: 2px solid #000;
}

.red-panel {
  background: linear-gradient(225deg, #4d000d 0%, var(--red-vivid) 100%);
  border-left: 2px solid #000;
}

.panel-content {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  z-index: 2;
}

.team-name {
  font-family: 'Anton', sans-serif;
  font-size: 3rem;
  letter-spacing: 2px;
  margin: 0;
  color: #fff;
  text-shadow: 0 4px 10px rgba(0,0,0,0.4);
}

.big-score {
  font-family: 'Anton', sans-serif;
  font-size: 15vw;
  line-height: 1;
  margin: 0;
  color: #fff;
  text-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.team-stats {
  display: flex;
  justify-content: center;
}

.stat-pill {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1.5rem;
  border-radius: 30px;
  font-weight: 900;
  letter-spacing: 1px;
  font-size: 1rem;
  border: 1px solid rgba(255,255,255,0.2);
}

.player-roster {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 2rem;
}

.player-card {
  position: relative;
  display: flex;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border-left: 4px solid #fff;
  transition: transform 0.2s;
}

/* Petit truc jaune à côté de la card (Blue Team) */
.blue-panel .player-card::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -15px;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  background-color: var(--yellow-vivid);
  box-shadow: 0 0 10px var(--yellow-glow);
  opacity: 0.8;
  transition: all 0.2s;
}

/* Petit truc jaune à côté de la card (Red Team) */
.red-panel .player-card::after {
  content: '';
  position: absolute;
  top: 50%;
  right: -15px;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  background-color: var(--yellow-vivid);
  box-shadow: 0 0 10px var(--yellow-glow);
  opacity: 0.8;
  transition: all 0.2s;
}

.player-card:hover {
  transform: scale(1.02);
  background: rgba(0, 0, 0, 0.7);
}

.player-card:hover::before, .player-card:hover::after {
  opacity: 1;
  box-shadow: 0 0 15px var(--yellow-vivid);
}

.blue-panel .player-card { border-color: var(--blue-bright); }
.red-panel .player-card { border-left: none; border-right: 4px solid var(--red-bright); }

.p-name {
  font-weight: 700;
  font-size: 1.1rem;
}

.p-mmr {
  font-weight: 900;
  color: rgba(255,255,255,0.7);
}

/* CENTER HUD */
.center-hud {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  gap: 2rem;
  pointer-events: none;
}

.hud-top, .hud-bottom {
  background: #000;
  border: 4px solid var(--yellow-vivid);
  border-radius: 20px;
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.8);
}

.hud-bottom {
  flex-direction: row;
  gap: 1.5rem;
  padding: 1.2rem 2rem;
  background: rgba(0,0,0,0.9);
}

.hud-label {
  font-size: 0.8rem;
  font-weight: 900;
  color: #ccc;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.hud-time {
  font-family: 'Anton', sans-serif;
  font-size: 3.5rem;
  color: var(--yellow-vivid);
  line-height: 1.1;
  text-shadow: 0 0 20px var(--yellow-glow);
}

.hud-vs {
  font-family: 'Anton', sans-serif;
  font-size: 4rem;
  color: #000;
  background: var(--yellow-vivid);
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 5px solid var(--yellow-vivid);
  box-shadow: 0 0 40px var(--yellow-glow), inset 0 0 10px rgba(0,0,0,0.5);
  text-shadow: none;
}

.hud-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
}

.hud-val {
  font-family: 'Anton', sans-serif;
  font-size: 2rem;
  color: #fff;
}

.highlight .hud-val {
  color: var(--yellow-vivid);
}

.hud-val small {
  font-size: 1rem;
  color: #999;
}

.hud-divider {
  width: 2px;
  height: 40px;
  background: #333;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .split-view {
    flex-direction: column;
  }
  
  .blue-panel { border-right: none; border-bottom: 2px solid #000; }
  .red-panel { border-left: none; border-top: 2px solid #000; }
  
  .big-score { font-size: 6rem; }
  .team-name { font-size: 2rem; }
  
  .center-hud {
    transform: translate(-50%, -50%) scale(0.7);
  }
}
</style>