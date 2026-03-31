<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Trophy, CheckCircle, XCircle, Palette, Bell, Info, LogOut, Pencil } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

const user = ref({
  photo: '',
  pseudo: '',
  prenom: '',
  nom: '',
  email: '',
  rank: 0,
  victories: 0,
  defeats: 0,
});

onMounted(() => {
  const stored = JSON.parse(localStorage.getItem('user_data') ?? '{}');
  console.log('Loaded user data:', stored);
  user.value = {
    photo: stored.avatar_url ?? '',
    pseudo: stored.pseudo ?? '',
    prenom: stored.prenom ?? '',
    nom: stored.nom ?? '',
    email: stored.email ?? '',
    rank: stored.elo ?? 0,
    victories: stored.total_wins ?? 0,
    defeats: (stored.total_matches ?? 0) - (stored.total_wins ?? 0),
  };
});

const theme = ref<'light' | 'dark'>('light');
const notifications = ref(true);

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
};

const handleLogout = () => {
  console.log('Logout');
};
</script>

<template>
  <div class="container">
    <div class="profil-card">

      <!-- Header -->
      <div class="profil-header">
        <div class="avatar">
          <img v-if="user.photo" :src="user.photo" alt="Photo de profil" />
          <span v-else class="avatar-placeholder">{{ user.pseudo.charAt(0).toUpperCase() }}</span>
        </div>
        <h2 class="pseudo">{{ user.pseudo }}</h2>
        <p class="fullname">{{ user.prenom }} {{ user.nom }}</p>
        <p class="email">{{ user.email }}</p>
        <button class="btn-edit" @click="router.push('/profile/edit')">
          <Pencil :size="14" />
          Modifier le profil
        </button>
      </div>

      <!-- Rank -->
      <div class="rank-card">
        <div class="rank-card__cover">
          <div class="rank-content">
            <Trophy :size="32" color="#000" />
            <span class="rank-value">{{ user.rank }}</span>
            <span class="rank-label">Rank</span>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-item">
          <CheckCircle :size="24" color="#16a34a" />
          <span class="stat-value">{{ user.victories }}</span>
          <span class="stat-label">Victoires</span>
        </div>
        <div class="stat-item">
          <XCircle :size="24" color="#dc2626" />
          <span class="stat-value">{{ user.defeats }}</span>
          <span class="stat-label">Défaites</span>
        </div>
      </div>

      <!-- Settings -->
      <div class="section">
        <h3 class="section-title">Paramètres</h3>

        <div class="setting-row">
          <div class="setting-info">
            <div class="setting-icon-wrap">
              <Palette :size="18" color="#FAC12D" />
            </div>
            <span class="setting-label">Thème</span>
          </div>
          <button class="toggle" :class="{ active: theme === 'light' }" @click="toggleTheme">
            <span class="toggle-thumb"></span>
            <span class="toggle-text">{{ theme === 'dark' ? 'Dark' : 'Light' }}</span>
          </button>
        </div>

        <div class="setting-row">
          <div class="setting-info">
            <div class="setting-icon-wrap">
              <Bell :size="18" color="#FAC12D" />
            </div>
            <span class="setting-label">Notifications</span>
          </div>
          <button class="toggle" :class="{ active: notifications }" @click="notifications = !notifications">
            <span class="toggle-thumb"></span>
            <span class="toggle-text">{{ notifications ? 'On' : 'Off' }}</span>
          </button>
        </div>

        <div class="setting-row clickable" @click="router.push('/about')">
          <div class="setting-info">
            <div class="setting-icon-wrap">
              <Info :size="18" color="#FAC12D" />
            </div>
            <span class="setting-label">À propos</span>
          </div>
          <span class="chevron">›</span>
        </div>
      </div>

      <!-- Logout -->
      <button class="btn-logout" @click="handleLogout">
        <LogOut :size="18" />
        Déconnexion
      </button>

    </div>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  background: #f4f4f4;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.profil-card {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* Header */
.profil-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 2rem;
  background: #ffffff;
  border: 1px solid #FAC12D44;
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 3px solid #FAC12D;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff8e1;
  margin-bottom: 0.75rem;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: 2.5rem;
  font-weight: 800;
  color: #FAC12D;
}

.pseudo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #FAC12D;
  margin: 0;
}

.fullname {
  font-size: 1rem;
  color: #1a1a1a;
  margin: 0;
}

.email {
  font-size: 0.875rem;
  color: #888888;
  margin: 0;
  margin-bottom: 0.5rem;
}

.btn-edit {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 1rem;
  border-radius: 9999px;
  border: 1px solid #FAC12D;
  background: transparent;
  color: #b8860b;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.25rem;
}

.btn-edit:hover {
  background: #FAC12D;
  color: #000;
}

/* Rank */
.rank-card {
  position: relative;
  z-index: 1;
  width: 100%;
  perspective: 1000px;
}

.rank-card::before {
  display: block;
  content: "";
  position: absolute;
  top: 5%;
  left: 5%;
  width: 90%;
  height: 90%;
  background: rgba(0, 0, 0, 0.25);
  box-shadow: 0 6px 12px 12px rgba(0, 0, 0, 0.2);
  will-change: opacity;
  transform-origin: top center;
  transform: skewX(0.001deg);
  transition: transform 0.35s ease-in-out, opacity 0.5s ease-in-out;
  border-radius: 20px;
}

.rank-card:hover::before {
  opacity: 0.6;
  transform: rotateX(7deg) translateY(-6px) scale(1.05);
}

.rank-card__cover {
  position: relative;
  z-index: 1;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, #FAC12D 0%, #f5a400 60%, #e8960a 100%);
  border-radius: 20px;
  border: 1px solid rgba(255, 220, 100, 0.4);
  perspective-origin: 50% 50%;
  transform-style: preserve-3d;
  transform-origin: top center;
  will-change: transform;
  transform: skewX(0.001deg);
  transition: transform 0.35s ease-in-out;
  box-shadow:
    0 8px 32px rgba(250, 193, 45, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.rank-card__cover::after {
  display: block;
  content: "";
  position: absolute;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 120%;
  background: linear-gradient(
    226deg,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0.4) 35%,
    rgba(255, 255, 255, 0.15) 42%,
    rgba(255, 255, 255, 0) 60%
  );
  transform: translateY(-20%);
  will-change: transform;
  transition: transform 0.65s cubic-bezier(0.18, 0.9, 0.58, 1);
  pointer-events: none;
}

.rank-card:hover .rank-card__cover {
  transform: rotateX(7deg) translateY(-6px);
}

.rank-card:hover .rank-card__cover::after {
  transform: translateY(0%);
}

.rank-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 2rem 1.5rem;
}

.rank-value {
  font-size: 3rem;
  font-weight: 900;
  color: #000;
  line-height: 1;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
}

.rank-label {
  font-size: 0.7rem;
  color: rgba(0, 0, 0, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 700;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  padding: 1.25rem 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a1a;
}

.stat-label {
  font-size: 0.7rem;
  color: #888888;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Section */
.section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-title {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #888888;
  margin-bottom: 0.25rem;
  padding-left: 0.25rem;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}

.setting-row.clickable {
  cursor: pointer;
  transition: background 0.2s ease;
}

.setting-row.clickable:hover {
  background: #fafafa;
  border-color: #FAC12D88;
}

.setting-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.setting-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #fff8e1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.setting-label {
  font-size: 1rem;
  color: #1a1a1a;
}

.chevron {
  font-size: 1.5rem;
  color: #FAC12D;
  line-height: 1;
}

/* Toggle */
.toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #eeeeee;
  border: 1px solid #dddddd;
  border-radius: 9999px;
  padding: 0.35rem 0.75rem 0.35rem 0.4rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #888888;
  font-size: 0.875rem;
  font-weight: 600;
}

.toggle.active {
  background: #fff8e1;
  border-color: #FAC12D;
  color: #b8860b;
}

.toggle-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #bbbbbb;
  transition: background 0.3s ease;
}

.toggle.active .toggle-thumb {
  background: #FAC12D;
}

/* Logout */
.btn-logout {
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #ffcccc;
  background: #fff5f5;
  color: #e53e3e;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-logout:hover {
  background: #ffe5e5;
  border-color: #e53e3e;
}
</style>
