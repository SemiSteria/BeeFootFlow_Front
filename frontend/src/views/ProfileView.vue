<template>
  <main class="profile-view">
    <div class="profile-header">
      <div class="avatar-container">
        <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.userName}`" :alt="user.userName" class="profile-avatar" />
      </div>
      <div class="user-info">
        <h1>{{ user.userName }}</h1>
        <p>Joueur d'élite • Elo actuel: {{ user.actElo }}</p>
      </div>
    </div>

    <div class="stats-card">
      <div class="stat-group">
        <span class="stat-value">{{ user.totalMatchs }}</span>
        <span class="stat-label">Matchs</span>
      </div>
      <div class="stat-group">
        <span class="stat-value">{{ user.totalWins }}</span>
        <span class="stat-label">Victoires</span>
      </div>
      <div class="stat-group">
        <span class="stat-value">{{ user.totalMatchs > 0 ? Math.round((user.totalWins / user.totalMatchs) * 100) : 0 }}%</span>
        <span class="stat-label">Taux de Win</span>
      </div>
    </div>

    <div class="menu-list">
      <div class="menu-item" v-for="item in menuItems" :key="item.label">
        <span class="menu-label">{{ item.label }}</span>
        <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
      <div class="menu-item logout" @click="handleLogout">
        <span class="menu-label">Déconnexion</span>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

type StoredUser = {
  id: string
  pseudo: string
  email: string
  elo: number
  elo_peak: number
  mmr: number
  total_matches: number
  total_wins: number
  total_goals: number
  created_at: string
}

const getStoredUser = (): StoredUser | null => {
  const raw = localStorage.getItem('user_data')
  if (!raw) return null

  try {
    return JSON.parse(raw) as StoredUser
  } catch {
    return null
  }
}

const storedUser = getStoredUser()

const user = ref({
  userName: storedUser?.pseudo ?? 'guest',
  totalMatchs: storedUser?.total_matches ?? 0,
  totalWins: storedUser?.total_wins ?? 0,
  actElo: storedUser?.elo ?? 0,
  email: storedUser?.email ?? ''
})

if (!storedUser) {
  router.replace('/')
}

const menuItems = [
  { label: "Historique des matchs" },
  { label: "Paramètres du compte" },
  { label: "Aide & Support" }
]

const handleLogout = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_data')
  
  console.log('Déconnexion de l\'utilisateur...')

  router.push('/')
}
</script>

<style scoped>
.profile-view {
  padding: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.avatar-container {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  overflow: hidden;
  border: 3px solid var(--primary);
  box-shadow: 0 10px 20px var(--accent-glow);
}

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: white;
}

h1 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.25rem;
}

p {
  color: #888;
  font-size: 0.85rem;
}

.stats-card {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: white;
  padding: 1.5rem;
  border-radius: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  border: 1px solid #f0f0f0;
}

.stat-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--primary);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 0.25rem;
}

.menu-list {
  background: white;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  border: 1px solid #f0f0f0;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s;
}

.menu-item:hover {
  background: #fcfcfc;
  padding-left: 1.75rem;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-label {
  font-weight: 600;
  color: #444;
}

.chevron {
  width: 18px;
  height: 18px;
  color: #ccc;
}

.logout .menu-label {
  color: #e74c3c;
}
@media (max-width: 480px) {
  .profile-view {
    padding: 1.25rem 1rem;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .stats-card {
    padding: 1rem;
    gap: 1rem;
  }
  
  .stat-value {
    font-size: 1.1rem;
  }
  
  .menu-item {
    padding: 1rem 1.25rem;
  }
}
</style>
