<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Users, Hash, Check, Shield } from 'lucide-vue-next'

type StoredUser = {
  id: string
  pseudo: string
}

const router = useRouter()

const API_URL = import.meta.env.VITE_API_URL ?? 'http://48h.sayzx.fr:30090'

const storedRaw = localStorage.getItem('user_data')
let storedUser: StoredUser | null = null

try {
  storedUser = storedRaw ? (JSON.parse(storedRaw) as StoredUser) : null
} catch {
  storedUser = null
}

if (!storedUser?.id) {
  router.replace('/')
}

const teamName = ref('')
const teamTag = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const displayTag = computed(() => {
  if (!teamTag.value) return 'TAG'
  return teamTag.value.toUpperCase()
})

const displayName = computed(() => {
  if (!teamName.value) return 'Nom de votre équipe'
  return teamName.value
})

const submitTeam = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!storedUser?.id) {
    errorMessage.value = 'Session utilisateur introuvable.'
    return
  }

  if (teamName.value.trim().length < 3) {
    errorMessage.value = 'Le nom doit contenir au moins 3 caractères.'
    return
  }

  isSubmitting.value = true

  try {
    const response = await fetch(`${API_URL}/teams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: teamName.value,
        tag: teamTag.value,
        userId: storedUser.id,
      }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      errorMessage.value = data.message ?? 'Impossible de créer l équipe.'
      return
    }

    successMessage.value = 'Équipe créée avec succès !'

    setTimeout(() => {
      router.push('/profile')
    }, 1000)
  } catch (error) {
    const details = error instanceof Error ? ` (${error.message})` : ''
    errorMessage.value = `Erreur de connexion au serveur${details}.`
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="create-team-page">
    <div class="content-container">
      <header class="page-header">
        <button class="icon-back-btn" @click="router.push('/profile')" title="Retour">
          <ArrowLeft :size="20" />
        </button>
        <div class="header-text">
          <h1>CRÉER UNE ÉQUIPE</h1>
          <p>Définis ton identité et mène ton équipe vers la victoire.</p>
        </div>
      </header>

      <!-- Preview Card -->
      <section class="preview-section">
        <div class="team-preview-card">
          <div class="preview-badge">APERÇU</div>
          <div class="preview-body">
            <div class="team-logo-placeholder">
              <Shield :size="40" color="#FAC12D" stroke-width="1.5" />
            </div>
            <div class="preview-info">
              <span class="preview-tag">[{{ displayTag }}]</span>
              <h2 class="preview-name">{{ displayName }}</h2>
            </div>
          </div>
          <div class="preview-footer">
            <span class="captain-tag">CAPITAINE: {{ storedUser?.pseudo || 'Vous' }}</span>
          </div>
        </div>
      </section>

      <form class="creation-form" @submit.prevent="submitTeam">
        <div class="form-group">
          <label for="team-name">
            <Users :size="14" /> NOM DE L'ÉQUIPE
          </label>
          <div class="input-wrapper">
            <input 
              id="team-name" 
              v-model="teamName" 
              type="text" 
              maxlength="30" 
              placeholder="Ex: Les Lions du Flow" 
              required 
            />
          </div>
        </div>

        <div class="form-group">
          <label for="team-tag">
            <Hash :size="14" /> TAG (3-4 LETTRES)
          </label>
          <div class="input-wrapper">
            <input 
              id="team-tag" 
              v-model="teamTag" 
              type="text" 
              maxlength="4" 
              placeholder="Ex: LDF" 
            />
          </div>
        </div>

        <button class="main-action-btn" type="submit" :disabled="isSubmitting || teamName.length < 3">
          <span v-if="!isSubmitting">CRÉER L'ÉQUIPE</span>
          <span v-else>CRÉATION EN COURS...</span>
          <Check v-if="!isSubmitting" :size="20" />
        </button>

        <Transition name="fade">
          <p v-if="errorMessage" class="message error-msg">{{ errorMessage }}</p>
        </Transition>
        <Transition name="fade">
          <p v-if="successMessage" class="message success-msg">{{ successMessage }}</p>
        </Transition>
      </form>
    </div>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;700;900&display=swap');

.create-team-page {
  min-height: 100vh;
  background-color: #FFFFFF;
  padding: 2rem 1.5rem 6rem;
  font-family: 'Inter', sans-serif;
}

.content-container {
  max-width: 480px;
  margin: 0 auto;
  animation: slideUp 0.6s ease-out;
}

.page-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.icon-back-btn {
  background: #F8F9FA;
  border: 1px solid #EDEDED;
  color: #000;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.icon-back-btn:hover {
  background: #FFF;
  border-color: #FAC12D;
  transform: translateX(-3px);
}

.header-text h1 {
  font-family: 'Anton', sans-serif;
  font-size: 2.2rem;
  line-height: 1;
  margin: 0;
  letter-spacing: 1px;
}

.header-text p {
  color: #666;
  font-size: 0.95rem;
  margin: 0.5rem 0 0;
  line-height: 1.4;
}

/* Preview Card */
.preview-section {
  margin-bottom: 2rem;
}

.team-preview-card {
  background: #000;
  color: #FFF;
  padding: 1.75rem;
  border-radius: 28px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0,0,0,0.15);
}

.team-preview-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(250, 193, 45, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

.preview-badge {
  font-size: 0.6rem;
  font-weight: 900;
  background: #FAC12D;
  color: #000;
  padding: 0.25rem 0.6rem;
  border-radius: 100px;
  width: fit-content;
  letter-spacing: 1px;
  margin-bottom: 1.25rem;
}

.preview-body {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  position: relative;
  z-index: 2;
}

.team-logo-placeholder {
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-info {
  display: flex;
  flex-direction: column;
}

.preview-tag {
  font-family: 'Anton', sans-serif;
  color: #FAC12D;
  font-size: 1rem;
  letter-spacing: 1px;
}

.preview-name {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: -0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 240px;
}

.preview-footer {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.captain-tag {
  font-size: 0.7rem;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Form Styles */
.creation-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.form-group label {
  font-size: 0.7rem;
  font-weight: 900;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  letter-spacing: 0.5px;
}

.input-wrapper {
  position: relative;
}

input {
  width: 100%;
  background: #F8F9FA;
  border: 1.5px solid #EDEDED;
  padding: 1.1rem 1.25rem;
  border-radius: 18px;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  color: #000;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  background: #FFF;
  border-color: #FAC12D;
  box-shadow: 0 0 0 4px rgba(250, 193, 45, 0.1);
}

.main-action-btn {
  margin-top: 1rem;
  background: #FAC12D;
  color: #000;
  border: none;
  padding: 1.2rem;
  border-radius: 20px;
  font-weight: 900;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(250, 193, 45, 0.25);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-action-btn:hover:not(:disabled) {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(250, 193, 45, 0.35);
}

.main-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.message {
  padding: 1rem;
  border-radius: 14px;
  font-size: 0.85rem;
  font-weight: 700;
  text-align: center;
  margin-top: 0.5rem;
}

.error-msg {
  background: #FFF5F5;
  color: #E53E3E;
  border: 1px solid #FED7D7;
}

.success-msg {
  background: #F0FFF4;
  color: #38A169;
  border: 1px solid #C6F6D5;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 480px) {
  .create-team-page {
    padding-top: 1.5rem;
  }
  
  .header-text h1 {
    font-size: 1.8rem;
  }
  
  .team-preview-card {
    padding: 1.5rem;
  }
  
  .preview-name {
    font-size: 1.2rem;
  }
}
</style>
