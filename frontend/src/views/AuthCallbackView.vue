<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type TokenPayload = {
  id: string
  email: string
  pseudo: string
  avatar_url?: string | null
  iat?: number
  exp?: number
}

const route = useRoute()
const router = useRouter()
const errorMessage = ref('Connexion OAuth invalide.')

const decodeJwtPayload = (token: string): TokenPayload | null => {
  const parts = token.split('.')
  if (parts.length < 2) return null

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    )

    return JSON.parse(json) as TokenPayload
  } catch {
    return null
  }
}

onMounted(() => {
  const token = route.query.token
  const oauthToken = typeof token === 'string' ? token : ''

  if (!oauthToken) {
    router.replace({ path: '/', query: { error: 'oauth_token_missing' } })
    return
  }

  const payload = decodeJwtPayload(oauthToken)

  if (!payload?.id || !payload.email || !payload.pseudo) {
    router.replace({ path: '/', query: { error: 'oauth_token_invalid' } })
    return
  }

  const user = {
    id: payload.id,
    pseudo: payload.pseudo,
    email: payload.email,
    avatar_url: payload.avatar_url ?? null,
    elo: 1000,
    elo_peak: 1000,
    mmr: 1000,
    total_matches: 0,
    total_wins: 0,
    total_goals: 0,
    created_at: new Date().toISOString(),
  }

  localStorage.setItem('auth_token', oauthToken)
  localStorage.setItem('user_data', JSON.stringify(user))
  router.replace('/home')
})
</script>

<template>
  <main class="auth-callback-view">
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </main>
</template>

<style scoped>
.auth-callback-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
}
</style>
