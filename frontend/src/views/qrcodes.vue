<template>
  <main class="matchmaking-view">
    <section class="qr-tab">
      <div class="qr-copy">
        <h1>QR Code</h1>
        <p>Scanne le QR code pour rejoindre la solo queue.</p>
      </div>

      <div class="scanner-square">
        <QrcodeStream
          v-if="scannerEnabled"
          :camera="cameraMode"
          @decode="onDecode"
          @init="onInit"
        />

        <div
          v-else
          class="scanner-placeholder"
        >
          <span>QR</span>
        </div>
      </div>

      <button
        class="scan-btn"
        type="button"
        @click="enableScanner"
      >
        Activer la caméra
      </button>

      <p class="qr-status">{{ scannerStatus }}</p>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { QrcodeStream } from 'qrcode-reader-vue3'

const scannerEnabled = ref(false)
const cameraMode = ref('off')
const scannerStatus = ref('Caméra inactive')

function enableScanner() {
  scannerEnabled.value = true
  cameraMode.value = 'rear'
  scannerStatus.value = 'Autorisation caméra...'
}

async function onInit(promise) {
  try {
    await promise
    scannerStatus.value = 'Caméra prête'
  } catch (error) {
    if (error?.name === 'OverconstrainedError' && cameraMode.value === 'rear') {
      cameraMode.value = 'auto'
      scannerStatus.value = 'Recherche d’une caméra disponible...'
      return
    }

    if (error?.name === 'NotAllowedError') {
      scannerStatus.value = 'Accès caméra refusé'
      return
    }

    if (error?.name === 'NotFoundError') {
      scannerStatus.value = 'Aucune caméra trouvée'
      return
    }

    if (error?.name === 'NotSupportedError') {
      scannerStatus.value = 'HTTPS ou localhost requis'
      return
    }

    scannerStatus.value = 'Impossible d’ouvrir la caméra'
  }
}

function onDecode(result) {
  scannerStatus.value = `QR détecté: ${result}`
}
</script>

<style scoped>
.matchmaking-view {
  min-height: 100%;
  padding: 1rem;
  max-width: 720px;
  margin: 0 auto;
}

.qr-tab {
  min-height: calc(100dvh - 140px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1rem;
}

.qr-copy {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

h1 {
  font-size: 1.75rem;
  color: #d4892a;
  margin: 0;
}

p {
  margin: 0;
  color: #666666;
}

.scanner-square {
  width: min(100%, 360px);
  aspect-ratio: 1 / 1;
  border-radius: 28px;
  overflow: hidden;
  background: #f8f9fa;
  border: 1px solid #ededed;
}

.scanner-square :deep(video),
.scanner-square :deep(canvas),
.scanner-square :deep(.qrcode-stream-wrapper) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scanner-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}

.scanner-placeholder span {
  width: 96px;
  height: 96px;
  border-radius: 24px;
  display: grid;
  place-items: center;
  background: #111111;
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 800;
}

.scan-btn {
  padding: 0.8rem 1.4rem;
  background-color: #d4892a;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

.qr-status {
  min-height: 1.5rem;
  font-size: 0.92rem;
  color: #666666;
}

@media (max-width: 480px) {
  .matchmaking-view {
    padding: 1rem 0.9rem 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  .qr-tab {
    min-height: calc(100dvh - 170px);
  }
}
</style>
