<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const gameCode = ref('');
const isJoining = ref(false);

const ongoingGames = ref([
  { id: '1', name: 'Tournoi du Midi', players: 2, maxPlayers: 4, type: '2vs2' },
  { id: '2', name: 'Entraînement Pro', players: 1, maxPlayers: 2, type: '1vs1' },
  { id: '3', name: 'Match Amical', players: 3, maxPlayers: 4, type: '2vs2' },
]);

const handleJoin = async () => {
  if (gameCode.value.length < 4) return;
  
  isJoining.value = true;
  // Simulate API call
  setTimeout(() => {
    isJoining.value = false;
    alert(`Rejoindre la partie: ${gameCode.value}`);
    // router.push(`/game/${gameCode.value}`);
  }, 1000);
};

const goBack = () => {
  router.back();
};

const joinQuickGame = (id: string) => {
  alert(`Rejoindre la partie rapide: ${id}`);
};
</script>

<template>
  <main class="join-page">
    <header class="page-header">
      <button @click="goBack" class="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <h1>Rejoindre</h1>
    </header>

    <div class="content-container">
      <section class="code-section">
        <div class="section-badge">CODE DE LA PARTIE</div>
        <p class="section-desc">Saisissez le code à 6 chiffres pour rejoindre vos amis.</p>
        
        <div class="code-input-wrapper">
          <input 
            v-model="gameCode" 
            type="text" 
            placeholder="Ex: 849 201" 
            maxlength="7"
            class="game-code-input"
          />
        </div>

        <button 
          @click="handleJoin" 
          class="join-btn" 
          :disabled="gameCode.length < 4 || isJoining"
        >
          {{ isJoining ? 'CONNEXION...' : 'REJOINDRE LE MATCH' }}
        </button>
      </section>

      <section class="ongoing-section">
        <div class="section-header">
          <div class="section-badge">PARTIES PUBLIQUES</div>
          <button class="view-all">Tout voir</button>
        </div>

        <div class="games-list">
          <div v-for="game in ongoingGames" :key="game.id" class="game-card" @click="joinQuickGame(game.id)">
            <div class="game-info">
              <h3>{{ game.name }}</h3>
              <p>{{ game.type }} • {{ game.players }}/{{ game.maxPlayers }} joueurs</p>
            </div>
            <div class="game-action">
              <div class="status-dot"></div>
              <span>En cours</span>
            </div>
          </div>
        </div>
      </section>

      <div class="empty-state">
        <div class="qr-placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
        </div>
        <p>Scanner un QR Code</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.join-page {
  min-height: 100vh;
  background-color: #FFFFFF;
  padding: 1.5rem;
  padding-top: env(safe-area-inset-top, 1.5rem);
  animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
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

.page-header h1 {
  font-size: 1.8rem;
  font-weight: 900;
  letter-spacing: -1px;
  margin: 0;
  text-transform: uppercase;
}

.content-container {
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
  max-width: 500px;
  margin: 0 auto;
}

.section-badge {
  font-size: 0.65rem;
  font-weight: 900;
  color: #000;
  letter-spacing: 1.5px;
  margin-bottom: 0.8rem;
  opacity: 0.8;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.view-all {
  background: none;
  border: none;
  color: #FAC12D;
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
}

.section-desc {
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 2rem;
}

.code-input-wrapper {
  margin-bottom: 1.5rem;
}

.game-code-input {
  width: 100%;
  background: #F8F9FA;
  border: 2px solid #EDEDED;
  padding: 1.5rem;
  border-radius: 20px;
  font-family: inherit;
  font-size: 2rem;
  font-weight: 900;
  text-align: center;
  letter-spacing: 4px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.game-code-input:focus {
  outline: none;
  background: #FFFFFF;
  border-color: #FAC12D;
  box-shadow: 0 10px 25px rgba(250, 193, 45, 0.15);
}

.join-btn {
  width: 100%;
  background: #000;
  color: #FFF;
  border: none;
  padding: 1.3rem;
  border-radius: 20px;
  font-weight: 900;
  font-size: 0.95rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.join-btn:disabled {
  background: #E5E7EB;
  color: #9CA3AF;
  cursor: not-allowed;
  box-shadow: none;
}

.join-btn:not(:disabled):hover {
  background: #FAC12D;
  color: #000;
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(250, 193, 45, 0.3);
}

.games-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.game-card {
  background: #FFFFFF;
  border: 1px solid #EDEDED;
  border-radius: 20px;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.game-card:hover {
  border-color: #FAC12D;
  transform: scale(1.02);
  box-shadow: 0 8px 16px rgba(0,0,0,0.03);
}

.game-info h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
}

.game-info p {
  margin: 0.2rem 0 0 0 ;
  font-size: 0.8rem;
  color: #666;
  font-weight: 600;
}

.game-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #F0FDF4;
  padding: 0.4rem 0.8rem;
  border-radius: 100px;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: #22C55E;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

.game-action span {
  font-size: 0.7rem;
  font-weight: 800;
  color: #166534;
  text-transform: uppercase;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  opacity: 0.5;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.empty-state:hover {
  opacity: 1;
}

.qr-placeholder {
  width: 80px;
  height: 80px;
  background: #F8F9FA;
  border: 2px dashed #D1D5DB;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.empty-state p {
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}

@media (max-width: 480px) {
  .join-page {
    padding: 1.25rem;
  }
  
  .game-code-input {
    font-size: 1.5rem;
    padding: 1.2rem;
  }
}
</style>