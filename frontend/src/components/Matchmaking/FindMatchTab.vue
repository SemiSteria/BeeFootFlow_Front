<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { QrcodeStream } from 'qrcode-reader-vue3';

const router = useRouter();
const isScanning = ref(false);
const scannerStatus = ref('');

const toggleScanner = () => {
  isScanning.value = !isScanning.value;
  if (!isScanning.value) {
    scannerStatus.value = '';
  }
};

const onDecode = (result: string) => {
  isScanning.value = false;
  router.push({ name: 'score', query: { match_id: result } });
};

const onInit = async (promise: Promise<any>) => {
  try {
    scannerStatus.value = 'Initialisation...';
    await promise;
    scannerStatus.value = '';
  } catch (error: any) {
    if (error.name === 'NotAllowedError') {
      scannerStatus.value = 'Accès caméra refusé';
    } else if (error.name === 'NotFoundError') {
      scannerStatus.value = 'Caméra introuvable';
    } else {
      scannerStatus.value = 'Erreur caméra';
    }
  }
};
</script>

<template>
  <div class="find-match-tab">
    <div class="matchmaking-container">
      <div class="solo-queue-card">
        <div class="card-gradient"></div>
        <div class="card-content">
          <div class="badge">MATCH RAPIDE</div>
          <h2>Rejoindre la Solo Queue</h2>
          <p>Scannez le code QR d'une table pour entrer instantanément dans la file d'attente.</p>
          
          <button @click="toggleScanner" class="scan-now-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
            SCANNER POUR JOUER
          </button>
        </div>
      </div>

      <div class="status-grid">
        <div class="status-item">
          <span class="label">Joueurs en ligne</span>
          <span class="value">42</span>
        </div>
        <div class="status-item">
          <span class="label">Tables actives</span>
          <span class="value">12</span>
        </div>
      </div>
    </div>

    <!-- Scanner Overlay -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isScanning" class="scanner-overlay">
          <div class="scanner-container">
            <div class="scanner-header">
              <h3>Scanner Table</h3>
              <button @click="toggleScanner" class="close-scanner">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <div class="scanner-view">
              <QrcodeStream @decode="onDecode" @init="onInit" />
              <div class="scanner-frame">
                <div class="corner top-left"></div>
                <div class="corner top-right"></div>
                <div class="corner bottom-left"></div>
                <div class="corner bottom-right"></div>
                <div class="scan-line"></div>
              </div>
            </div>
            
            <div class="scanner-footer">
              <p v-if="scannerStatus" class="status-msg">{{ scannerStatus }}</p>
              <p v-else>Alignez le QR code</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.find-match-tab {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: fadeIn 0.4s ease-out;
}

.matchmaking-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.solo-queue-card {
  position: relative;
  background: #000;
  border-radius: 28px;
  padding: 2.5rem;
  overflow: hidden;
  color: #FFF;
}

.card-gradient {
  position: absolute;
  top: -50%;
  right: -20%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(250, 193, 45, 0.2) 0%, transparent 70%);
  pointer-events: none;
}

.card-content {
  position: relative;
  z-index: 1;
}

.badge {
  display: inline-block;
  background: #FAC12D;
  color: #000;
  padding: 0.4rem 0.8rem;
  border-radius: 100px;
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 1px;
  margin-bottom: 1.2rem;
}

.solo-queue-card h2 {
  font-size: 1.8rem;
  font-weight: 950;
  letter-spacing: -1px;
  margin: 0 0 0.8rem 0;
  line-height: 1.1;
}

.solo-queue-card p {
  color: #A1A1AA;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 2rem;
  max-width: 80%;
}

.scan-now-btn {
  background: #FFF;
  color: #000;
  border: none;
  padding: 1.2rem 2rem;
  border-radius: 18px;
  font-weight: 900;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.scan-now-btn:hover {
  background: #FAC12D;
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(250, 193, 45, 0.3);
}

.status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.status-item {
  background: #F8F9FA;
  border: 1px solid #EDEDED;
  padding: 1.5rem;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.status-item .label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-item .value {
  font-size: 1.5rem;
  font-weight: 950;
  color: #000;
}

/* Scanner Overlay - Identical to JoinGameTab for consistency */
.scanner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.scanner-container {
  width: 100%;
  max-width: 400px;
  background: #FFF;
  border-radius: 32px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.scanner-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.scanner-header h3 {
  margin: 0;
  font-weight: 900;
  font-size: 1.1rem;
  text-transform: uppercase;
}

.close-scanner {
  background: #F3F4F6;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.scanner-view {
  position: relative;
  aspect-ratio: 1;
  background: #000;
  margin: 0 1.5rem;
  border-radius: 24px;
  overflow: hidden;
}

.scanner-frame {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.corner {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 4px solid #FAC12D;
}

.top-left { top: 30px; left: 30px; border-right: 0; border-bottom: 0; border-radius: 8px 0 0 0; }
.top-right { top: 30px; right: 30px; border-left: 0; border-bottom: 0; border-radius: 0 8px 0 0; }
.bottom-left { bottom: 30px; left: 30px; border-right: 0; border-top: 0; border-radius: 0 0 0 8px; }
.bottom-right { bottom: 30px; right: 30px; border-left: 0; border-top: 0; border-radius: 0 0 8px 0; }

.scan-line {
  width: 80%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #FAC12D, transparent);
  box-shadow: 0 0 15px #FAC12D;
  position: absolute;
  animation: scan 2s linear infinite;
}

.scanner-footer {
  padding: 1.5rem;
  text-align: center;
}

.scanner-footer p {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
}

@keyframes scan {
  0% { transform: translateY(-100px); opacity: 0; }
  100% { transform: translateY(100px); opacity: 0; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
