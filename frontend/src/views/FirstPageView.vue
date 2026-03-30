<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLogin = ref(true);
const email = ref('');
const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isSubmitting = ref(false);
const API_URL = import.meta.env.VITE_API_URL ?? 'http://beefootflow-backend-svc:8080';

type UserData = {
  id: string;
  pseudo: string;
  email: string;
  elo: number;
  elo_peak: number;
  mmr: number;
  total_matches: number;
  total_wins: number;
  total_goals: number;
  created_at: string;
};

const persistUserSession = (user: UserData) => {
  localStorage.setItem('user_data', JSON.stringify(user));
  localStorage.setItem('auth_token', user.id);
};

const handleAuth = async () => {
  errorMessage.value = '';

  isSubmitting.value = true;

  try {
    const endpoint = isLogin.value ? '/auth/login' : '/auth/register';

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      errorMessage.value = data.message ?? 'Inscription impossible pour le moment.';
      return;
    }

    if (!data.user) {
      errorMessage.value = 'Réponse serveur invalide.';
      return;
    }

    persistUserSession(data.user as UserData);

    router.push('/home');
  } catch (error) {
    const details = error instanceof Error ? ` (${error.message})` : '';
    errorMessage.value = `Impossible de contacter le serveur${details}.`;
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <main class="first-page">
    <div class="auth-container">
      <div class="brand-header">
        <img src="/favicon.svg" alt="BeeFootFlow Logo" class="brand-logo" />
        <div class="brand-text">
          <h1>BeeFoot<span>Flow</span></h1>
          <p>L'élite du baby-foot entre vos mains.</p>
        </div>
      </div>

      <div class="auth-card">
        <div class="auth-tabs">
          <button 
            :class="{ active: isLogin }" 
            @click="isLogin = true"
          >CONNEXION</button>
          <button 
            :class="{ active: !isLogin }" 
            @click="isLogin = false"
          >INSCRIPTION</button>
        </div>

        <form @submit.prevent="handleAuth" class="auth-form">
          <div class="input-group">
            <label>ADRESSE EMAIL</label>
            <input type="email" v-model="email" placeholder="nom@exemple.com" required />
          </div>

          <div class="input-group" v-if="!isLogin">
            <label>NOM D'UTILISATEUR</label>
            <input type="text" v-model="username" placeholder="Votre nom d'utilisateur" />
          </div>

          <div class="input-group">
            <label>MOT DE PASSE</label>
            <input type="password" v-model="password" placeholder="••••••••" required />
          </div>

          <button type="submit" class="auth-btn" :disabled="isSubmitting">
            {{ isSubmitting ? 'ENVOI...' : (isLogin ? 'SE CONNECTER' : 'REJOINDRE LE FLOW') }}
          </button>

          <p v-if="errorMessage" class="auth-error">{{ errorMessage }}</p>
        </form>

        <p class="auth-footer" v-if="isLogin">
          Mot de passe oublié ? <span>Récupérer</span>
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.first-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #FFFFFF;
}

.auth-container {
  width: 100%;
  max-width: 400px;
  animation: fadeIn 0.8s ease-out;
}

.brand-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 3.5rem;
}

.brand-logo {
  width: 80px;
  height: 80px;
  margin-bottom: 1.5rem;
}

.brand-text h1 {
  font-size: 2.8rem;
  font-weight: 950;
  margin: 0;
  letter-spacing: -2px;
  text-transform: uppercase;
  color: #000;
  line-height: 1;
}

.brand-text h1 span {
  color: #FAC12D;
}

.brand-text p {
  color: #666;
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 0.5rem;
}

/* Auth Card */
.auth-card {
  background: #FFFFFF;
  border: 1px solid #EDEDED;
  border-radius: 32px;
  padding: 2.5rem;
  box-shadow: 0 15px 40px rgba(0,0,0,0.03);
}

.auth-tabs {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  border-bottom: 1px solid #F1F5F9;
}

.auth-tabs button {
  background: none;
  border: none;
  font-size: 0.8rem;
  font-weight: 900;
  color: #94A3B8;
  padding-bottom: 1rem;
  cursor: pointer;
  letter-spacing: 1px;
  position: relative;
  transition: all 0.3s ease;
}

.auth-tabs button.active {
  color: #000;
}

.auth-tabs button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #FAC12D;
}

/* Form Styles */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.input-group label {
  font-size: 0.65rem;
  font-weight: 900;
  color: #000;
  letter-spacing: 1px;
}

.input-group input {
  background: #F8F9FA;
  border: 1px solid #EDEDED;
  padding: 1.1rem 1.25rem;
  border-radius: 16px;
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.input-group input:focus {
  outline: none;
  background: #FFFFFF;
  border-color: #FAC12D;
  box-shadow: 0 0 0 4px rgba(250, 193, 45, 0.1);
}

.auth-btn {
  background: #FAC12D;
  color: #000;
  border: none;
  padding: 1.2rem;
  border-radius: 18px;
  font-weight: 900;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 1rem;
  box-shadow: 0 8px 24px rgba(250, 193, 45, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.auth-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
  transform: none;
  box-shadow: 0 8px 24px rgba(250, 193, 45, 0.2);
}

.auth-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(250, 193, 45, 0.3);
}

.auth-footer {
  text-align: center;
  font-size: 0.75rem;
  color: #94A3B8;
  margin-top: 2rem;
  font-weight: 600;
}

.auth-footer span {
  color: #FAC12D;
  cursor: pointer;
}

.auth-error {
  color: #B42318;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: -0.4rem;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 480px) {
  .first-page {
    padding: 1.5rem 1rem;
  }
  
  .auth-card {
    padding: 1.5rem;
    border-radius: 24px;
  }
  
  .brand-text h1 {
    font-size: 2.2rem;
  }
  
  .brand-header {
    margin-bottom: 2.5rem;
  }
  
  .brand-logo {
    width: 60px;
    height: 60px;
  }
}
</style>
