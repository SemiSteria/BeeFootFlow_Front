<script setup lang="ts">
import { ref } from 'vue';

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
  setTimeout(() => {
    isJoining.value = false;
    alert(`Rejoindre la partie: ${gameCode.value}`);
  }, 1000);
};

const joinQuickGame = (id: string) => {
  alert(`Rejoindre la partie rapide: ${id}`);
};
</script>

<template>
  <div class="join-game-tab">
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

    <div class="qr-scanner-shortcut">
      <div class="qr-placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
      </div>
      <p>Scanner un QR Code</p>
    </div>
  </div>
</template>

<style scoped>
.join-game-tab {
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
  animation: fadeIn 0.4s ease-out;
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
  transform: scale(1.01);
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

.qr-scanner-shortcut {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  opacity: 0.5;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.qr-scanner-shortcut:hover {
  opacity: 1;
}

.qr-placeholder {
  width: 64px;
  height: 64px;
  background: #F8F9FA;
  border: 2px dashed #D1D5DB;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.qr-scanner-shortcut p {
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
