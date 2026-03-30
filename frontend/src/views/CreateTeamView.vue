<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

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

const submitTeam = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!storedUser?.id) {
    errorMessage.value = 'Session utilisateur introuvable.'
    return
  }

  if (teamName.value.trim().length < 3) {
    errorMessage.value = 'Le nom de l equipe doit contenir au moins 3 caracteres.'
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
      errorMessage.value = data.message ?? 'Impossible de creer l equipe.'
      return
    }

    successMessage.value = 'Equipe creee avec succes.'

    setTimeout(() => {
      router.push('/profile')
    }, 700)
  } catch (error) {
    const details = error instanceof Error ? ` (${error.message})` : ''
    errorMessage.value = `Impossible de contacter le serveur${details}.`
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="create-team-view">
    <header class="header">
      <button class="back-btn" @click="router.push('/profile')">Retour</button>
      <h1>Creer une equipe</h1>
      <p>Definis ton equipe et deviens capitaine.</p>
    </header>

    <form class="form-card" @submit.prevent="submitTeam">
      <label for="team-name">Nom de l equipe</label>
      <input
        id="team-name"
        v-model="teamName"
        type="text"
        maxlength="60"
        placeholder="Ex: Les Meteor"
        required
      />

      <label for="team-tag">Tag (optionnel)</label>
      <input
        id="team-tag"
        v-model="teamTag"
        type="text"
        maxlength="10"
        placeholder="Ex: MTR"
      />

      <button class="submit-btn" type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Creation...' : 'Creer mon equipe' }}
      </button>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </form>
  </main>
</template>

<style scoped>
.create-team-view {
  max-width: 560px;
  margin: 0 auto;
  padding: 1.5rem;
}

.header h1 {
  margin: 0;
  font-size: 1.7rem;
}

.header p {
  margin: 0.5rem 0 1.2rem;
  color: #666;
}

.back-btn {
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 10px;
  padding: 0.45rem 0.8rem;
  cursor: pointer;
  margin-bottom: 0.9rem;
}

.form-card {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 20px;
  padding: 1.4rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
}

label {
  font-size: 0.78rem;
  font-weight: 700;
  color: #222;
}

input {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 0.8rem 0.9rem;
  font-size: 0.95rem;
}

input:focus {
  outline: none;
  border-color: #fac12d;
  box-shadow: 0 0 0 4px rgba(250, 193, 45, 0.15);
}

.submit-btn {
  margin-top: 0.8rem;
  border: none;
  border-radius: 14px;
  background: #fac12d;
  color: #111;
  padding: 0.9rem;
  font-weight: 800;
  cursor: pointer;
}

.submit-btn:disabled {
  cursor: not-allowed;
  opacity: 0.75;
}

.error {
  color: #b42318;
  font-size: 0.85rem;
}

.success {
  color: #067647;
  font-size: 0.85rem;
}
</style>
