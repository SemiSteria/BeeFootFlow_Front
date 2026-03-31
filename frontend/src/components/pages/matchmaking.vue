<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

// @ts-expect-error qrcode-reader-vue3 runtime works here but its typings are not resolved cleanly in this setup.
import { QrcodeStream } from 'qrcode-reader-vue3'

type AppStep = 'scan' | 'lobby' | 'live'
type TeamSide = 'A' | 'B' | null
type CameraMode = 'auto' | 'rear' | 'front' | 'off'
type ScannerState = 'idle' | 'requesting' | 'ready' | 'error' | 'scanned'

interface PlayerBubble {
  id: string
  nickname: string
  rank: string
  avatar: string
  team: TeamSide
  ready: boolean
  offsetX: number
}

interface LiveState {
  scoreA: number
  scoreB: number
  speed: number
  averageSpeed: number
  maxSpeed: number
  elapsedSeconds: number
}

const step = ref<AppStep>('scan')
const TEAM_SNAP_OFFSET = 28
const cameraMode = ref<CameraMode>('off')
const scannerEnabled = ref(false)
const scannerState = ref<ScannerState>('idle')
const scannerError = ref('')
const sessionCode = ref('')

const players = ref<PlayerBubble[]>([
  { id: 'p1', nickname: 'Lina', rank: 'Gold II', avatar: 'LI', team: null, ready: true, offsetX: 0 },
  { id: 'p2', nickname: 'Milo', rank: 'Plat IV', avatar: 'MI', team: null, ready: true, offsetX: 0 },
  { id: 'p3', nickname: 'Sarah', rank: 'Diam I', avatar: 'SA', team: null, ready: true, offsetX: 0 },
  { id: 'p4', nickname: 'Noa', rank: 'Silver III', avatar: 'NO', team: null, ready: true, offsetX: 0 },
])

const activeDragId = ref<string | null>(null)
const dragStartX = ref(0)
const liveInterval = ref<number | null>(null)

const liveState = ref<LiveState>({
  scoreA: 0,
  scoreB: 0,
  speed: 18,
  averageSpeed: 18,
  maxSpeed: 24,
  elapsedSeconds: 0,
})

const teamACount = computed(
  () => players.value.filter((player) => player.team === 'A').length,
)

const teamBCount = computed(
  () => players.value.filter((player) => player.team === 'B').length,
)

const allReady = computed(() => players.value.every((player) => player.ready))

const canLaunch = computed(
  () => teamACount.value === 2 && teamBCount.value === 2 && allReady.value,
)

const clockLabel = computed(() => formatTime(liveState.value.elapsedSeconds))

const scannerLabel = computed(() => {
  if (scannerState.value === 'idle') return 'Caméra inactive'
  if (scannerState.value === 'requesting') return 'Autorisation caméra...'
  if (scannerState.value === 'ready') return 'Scanne le QR code'
  if (scannerState.value === 'scanned') return 'QR code scanné'
  return scannerError.value || 'Erreur caméra'
})

function getSnapOffset(team: TeamSide) {
  if (team === 'A') return -TEAM_SNAP_OFFSET
  if (team === 'B') return TEAM_SNAP_OFFSET
  return 0
}

function getBubbleTransform(player: PlayerBubble) {
  return `translateX(${getSnapOffset(player.team) + player.offsetX}px)`
}

function enableScanner() {
  scannerEnabled.value = true
  cameraMode.value = 'auto'
  scannerState.value = 'requesting'
  scannerError.value = ''
}

async function onScannerInit(promise: Promise<MediaTrackCapabilities>) {
  scannerState.value = 'requesting'

  try {
    await promise
    scannerState.value = 'ready'
  } catch (error) {
    scannerState.value = 'error'
    scannerError.value = getCameraError(error)
  }
}

function onDecode(value: string) {
  sessionCode.value = value
  scannerEnabled.value = false
  cameraMode.value = 'off'
  scannerState.value = 'scanned'
  step.value = 'lobby'
}

function simulateScan() {
  onDecode('beefootflow://table-01/session-demo')
}

function startDrag(playerId: string, event: PointerEvent) {
  activeDragId.value = playerId
  dragStartX.value = event.clientX
}

function moveDrag(playerId: string, event: PointerEvent) {
  if (activeDragId.value !== playerId) return

  const player = players.value.find((entry) => entry.id === playerId)

  if (!player) return

  const delta = event.clientX - dragStartX.value
  player.offsetX = Math.max(-110, Math.min(110, delta))
}

function endDrag(playerId: string) {
  if (activeDragId.value !== playerId) return

  const player = players.value.find((entry) => entry.id === playerId)

  if (!player) {
    activeDragId.value = null
    return
  }

  if (player.offsetX <= -70) {
    assignTeam(player, 'A')
  } else if (player.offsetX >= 70) {
    assignTeam(player, 'B')
  } else {
    player.offsetX = 0
  }

  activeDragId.value = null
}

function assignTeam(player: PlayerBubble, team: 'A' | 'B') {
  const otherPlayersInTarget = players.value.filter(
    (entry) => entry.id !== player.id && entry.team === team,
  ).length

  if (otherPlayersInTarget >= 2) {
    player.offsetX = 0
    return
  }

  player.team = team
  player.offsetX = 0
}

function launchMatch() {
  if (!canLaunch.value) return

  step.value = 'live'
  liveState.value = {
    scoreA: 0,
    scoreB: 0,
    speed: 18,
    averageSpeed: 18,
    maxSpeed: 24,
    elapsedSeconds: 0,
  }

  stopSimulation()
  liveInterval.value = window.setInterval(() => {
    liveState.value.elapsedSeconds += 1

    const nextSpeed = clamp(liveState.value.speed + randomBetween(-3, 4), 12, 42)
    liveState.value.speed = nextSpeed
    liveState.value.averageSpeed = Math.round(
      (liveState.value.averageSpeed * 4 + nextSpeed) / 5,
    )
    liveState.value.maxSpeed = Math.max(liveState.value.maxSpeed, nextSpeed)
  }, 1000)
}

function simulateGoal(team: 'A' | 'B') {
  if (team === 'A') {
    liveState.value.scoreA += 1
  } else {
    liveState.value.scoreB += 1
  }

  const goalSpeed = randomBetween(18, 40)
  liveState.value.speed = goalSpeed
  liveState.value.averageSpeed = Math.round(
    (liveState.value.averageSpeed * 3 + goalSpeed) / 4,
  )
  liveState.value.maxSpeed = Math.max(liveState.value.maxSpeed, goalSpeed)
}

function backToLobby() {
  stopSimulation()
  step.value = 'lobby'
}

function resetToScan() {
  stopSimulation()
  step.value = 'scan'
  scannerEnabled.value = false
  cameraMode.value = 'off'
  scannerState.value = 'idle'
  scannerError.value = ''
  sessionCode.value = ''
  players.value = players.value.map((player) => ({
    ...player,
    team: null,
    offsetX: 0,
  }))
}

function stopSimulation() {
  if (liveInterval.value !== null) {
    window.clearInterval(liveInterval.value)
    liveInterval.value = null
  }
}

function getCameraError(error: unknown) {
  if (!(error instanceof Error)) return 'Erreur caméra inconnue'
  if (error.name === 'NotAllowedError') return 'Accès caméra refusé'
  if (error.name === 'NotFoundError') return 'Aucune caméra trouvée'
  if (error.name === 'NotSupportedError') return 'HTTPS ou localhost requis'
  if (error.name === 'NotReadableError') return 'Caméra déjà utilisée'
  return error.message || 'Impossible d’ouvrir la caméra'
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

onBeforeUnmount(() => {
  stopSimulation()
})
</script>

<template>
  <div class="matchmaking-page">
    <section
      v-if="step === 'scan'"
      class="scan-screen"
    >
      <div class="scan-box">
        <p class="mini-label">BeeFootFlow</p>
        <h1>Scanne le QR code</h1>
        <p class="soft-text">{{ scannerLabel }}</p>

        <div class="scanner-square">
          <QrcodeStream
            v-if="scannerEnabled"
            :camera="cameraMode"
            @decode="onDecode"
            @init="onScannerInit"
          />

          <div
            v-else
            class="scanner-placeholder"
          >
            <span>QR</span>
          </div>
        </div>

        <div class="scan-actions">
          <button
            class="primary-button"
            type="button"
            @click="enableScanner"
          >
            Autoriser la caméra
          </button>
          <button
            class="ghost-button"
            type="button"
            @click="simulateScan"
          >
            Simuler
          </button>
        </div>
      </div>
    </section>

    <section
      v-else-if="step === 'lobby'"
      class="lobby-screen"
    >
      <div class="top-bar">
        <div class="team-pill team-a">
          <span>Team A</span>
          <strong>{{ teamACount }}/2</strong>
        </div>

        <div class="center-status">
          <span>All ready simulé</span>
          <small>{{ sessionCode || 'session locale' }}</small>
        </div>

        <div class="team-pill team-b">
          <span>Team B</span>
          <strong>{{ teamBCount }}/2</strong>
        </div>
      </div>

      <p class="swipe-hint">Swipe à gauche pour A, à droite pour B</p>

      <div class="bubble-grid">
        <article
          v-for="player in players"
          :key="player.id"
          class="bubble-item"
        >
          <div
            class="bubble-shell"
            :class="{
              'is-team-a': player.team === 'A',
              'is-team-b': player.team === 'B',
            }"
            :style="{ transform: getBubbleTransform(player) }"
            @pointerdown="startDrag(player.id, $event)"
            @pointermove="moveDrag(player.id, $event)"
            @pointerup="endDrag(player.id)"
            @pointercancel="endDrag(player.id)"
          >
            <div class="player-bubble">
              {{ player.avatar }}
            </div>
          </div>

          <strong>{{ player.nickname }}</strong>
          <span>{{ player.rank }}</span>
          <small>{{ player.team ? `Team ${player.team}` : 'Non assigné' }}</small>
        </article>
      </div>

      <div class="lobby-actions">
        <button
          class="ghost-button"
          type="button"
          @click="resetToScan"
        >
          Retour scan
        </button>
        <button
          class="primary-button"
          type="button"
          :disabled="!canLaunch"
          @click="launchMatch"
        >
          Lancer la partie
        </button>
      </div>
    </section>

    <section
      v-else
      class="live-screen"
    >
      <div class="live-score">
        <div class="score-side">
          <span>Team A</span>
          <strong>{{ liveState.scoreA }}</strong>
        </div>

        <div class="score-center">
          <strong>{{ clockLabel }}</strong>
          <small>Match en cours</small>
        </div>

        <div class="score-side">
          <span>Team B</span>
          <strong>{{ liveState.scoreB }}</strong>
        </div>
      </div>

      <div class="live-metrics">
        <article class="metric">
          <span>Vitesse</span>
          <strong>{{ liveState.speed }} km/h</strong>
        </article>
        <article class="metric">
          <span>Moyenne</span>
          <strong>{{ liveState.averageSpeed }} km/h</strong>
        </article>
        <article class="metric">
          <span>Max</span>
          <strong>{{ liveState.maxSpeed }} km/h</strong>
        </article>
      </div>

      <div class="live-actions">
        <button
          class="ghost-button"
          type="button"
          @click="simulateGoal('A')"
        >
          But A
        </button>
        <button
          class="ghost-button"
          type="button"
          @click="simulateGoal('B')"
        >
          But B
        </button>
        <button
          class="primary-button"
          type="button"
          @click="backToLobby"
        >
          Retour lobby
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.matchmaking-page {
  min-height: 100vh;
  background: #ffffff;
  color: #111827;
  padding: 20px;
}

.scan-screen,
.lobby-screen,
.live-screen {
  width: min(100%, 680px);
  margin: 0 auto;
}

.scan-screen {
  min-height: calc(100vh - 40px);
  display: grid;
  place-items: center;
}

.scan-box {
  width: 100%;
  text-align: center;
}

.mini-label {
  margin: 0 0 8px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6b7280;
}

h1 {
  margin: 0 0 10px;
  font-size: clamp(2rem, 8vw, 2.8rem);
  line-height: 1;
}

.soft-text {
  margin: 0 0 24px;
  color: #6b7280;
}

.scanner-square {
  aspect-ratio: 1 / 1;
  width: min(100%, 420px);
  margin: 0 auto;
  overflow: hidden;
  border-radius: 28px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
}

.scanner-square :deep(video),
.scanner-square :deep(canvas) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scanner-square :deep(.qrcode-stream-wrapper) {
  width: 100%;
  height: 100%;
}

.scanner-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}

.scanner-placeholder span {
  width: 112px;
  height: 112px;
  border-radius: 28px;
  display: grid;
  place-items: center;
  background: #111827;
  color: #ffffff;
  font-size: 1.4rem;
  font-weight: 800;
}

.scan-actions,
.lobby-actions,
.live-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
}

.primary-button,
.ghost-button {
  border: none;
  border-radius: 999px;
  padding: 14px 18px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
}

.primary-button {
  background: #111827;
  color: #ffffff;
}

.primary-button:disabled {
  background: #d1d5db;
  color: #6b7280;
  cursor: not-allowed;
}

.ghost-button {
  background: #f3f4f6;
  color: #111827;
}

.top-bar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: center;
  margin-bottom: 18px;
}

.team-pill,
.center-status {
  border-radius: 20px;
  padding: 14px;
  text-align: center;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

.team-pill span,
.center-status span,
.center-status small,
.score-side span,
.score-center small,
.metric span,
.bubble-item span,
.bubble-item small,
.swipe-hint {
  color: #6b7280;
}

.team-pill strong,
.score-side strong,
.score-center strong,
.metric strong {
  display: block;
  color: #111827;
}

.team-a {
  background: #ecfeff;
}

.team-b {
  background: #fff7ed;
}

.center-status {
  min-width: 148px;
}

.swipe-hint {
  margin: 0 0 20px;
  text-align: center;
}

.bubble-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 12px;
}

.bubble-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.bubble-shell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 132px;
  height: 132px;
  margin-bottom: 10px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
  transition:
    transform 0.16s ease,
    border-color 0.16s ease,
    box-shadow 0.16s ease;
  touch-action: pan-y;
  user-select: none;
}

.bubble-shell.is-team-a {
  border-color: #67e8f9;
  background: #ecfeff;
}

.bubble-shell.is-team-b {
  border-color: #fdba74;
  background: #fff7ed;
}

.player-bubble {
  width: 88px;
  height: 88px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #111827;
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 800;
}

.bubble-item strong,
.bubble-item span,
.bubble-item small {
  display: block;
}

.bubble-item strong {
  margin-bottom: 4px;
}

.live-score {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 14px;
  align-items: center;
  margin-bottom: 20px;
}

.score-side,
.score-center,
.metric {
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  padding: 18px;
  text-align: center;
  background: #f9fafb;
}

.score-side strong,
.score-center strong {
  font-size: clamp(2.4rem, 8vw, 4rem);
  line-height: 1;
}

.live-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.metric strong {
  margin-top: 8px;
  font-size: 1.3rem;
}

@media (max-width: 640px) {
  .matchmaking-page {
    padding: 14px;
  }

  .scan-screen {
    min-height: calc(100vh - 28px);
  }

  .top-bar,
  .live-score,
  .live-metrics {
    grid-template-columns: 1fr;
  }

  .bubble-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px 6px;
  }

  .bubble-shell {
    width: 118px;
    height: 118px;
  }

  .player-bubble {
    width: 78px;
    height: 78px;
  }
}
</style>
