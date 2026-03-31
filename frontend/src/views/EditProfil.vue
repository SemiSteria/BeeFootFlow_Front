<script setup lang="ts">
import { ref } from 'vue';
import { ArrowLeft, Camera, User, Mail, Save } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

const API_URL = import.meta.env.VITE_API_URL ?? 'http://48h.sayzx.fr:30090';

const storedUser = JSON.parse(localStorage.getItem('user_data') ?? '{}');
const userId = localStorage.getItem('auth_token');

const form = ref({
  pseudo: storedUser.pseudo ?? '',
  prenom: storedUser.prenom ?? '',
  nom: storedUser.nom ?? '',
  email: storedUser.email ?? '',
});

const avatarUrl = ref<string | null>(storedUser.avatar_url ?? null);
const fileInput = ref<HTMLInputElement | null>(null);
const saving = ref(false);
const errorMsg = ref('');

const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    avatarUrl.value = ev.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const handleSave = async () => {
  saving.value = true;
  errorMsg.value = '';

  try {
    // Tenta actualizar no backend
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pseudo: form.value.pseudo,
        email: form.value.email,
      }),
    });

    let serverData = {};
    if (res.ok) {
      serverData = await res.json().catch(() => ({}));
    }

    // Persiste sempre no localStorage (inclui prenom/nom e avatar)
    const newUserData = {
      ...storedUser,
      ...serverData,
      pseudo: form.value.pseudo,
      email: form.value.email,
      prenom: form.value.prenom,
      nom: form.value.nom,
      avatar_url: avatarUrl.value,
    };
    localStorage.setItem('user_data', JSON.stringify(newUserData));

    router.push('/profile');
  } catch {
    // Mesmo sem rede, guarda localmente
    const newUserData = {
      ...storedUser,
      pseudo: form.value.pseudo,
      email: form.value.email,
      prenom: form.value.prenom,
      nom: form.value.nom,
      avatar_url: avatarUrl.value,
    };
    localStorage.setItem('user_data', JSON.stringify(newUserData));
    router.push('/profile');
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div class="container">
    <div class="edit-card">

      <!-- Top bar -->
      <div class="topbar">
        <button class="btn-back" @click="router.push('/profile')">
          <ArrowLeft :size="20" />
        </button>
        <h1 class="page-title">Modifier le profil</h1>
        <div style="width: 36px;" />
      </div>

      <!-- Avatar -->
      <div class="avatar-section">
        <div class="avatar" @click="fileInput?.click()">
          <img v-if="avatarUrl" :src="avatarUrl" class="avatar-img" alt="avatar" />
          <span v-else class="avatar-placeholder">{{ form.pseudo.charAt(0).toUpperCase() || '?' }}</span>
          <button class="avatar-edit" type="button">
            <Camera :size="16" color="#000" />
          </button>
        </div>
        <p class="avatar-hint">Changer la photo</p>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          style="display: none"
          @change="onFileChange"
        />
      </div>

      <!-- Form -->
      <div class="form-section">
        <h3 class="section-title">Informations personnelles</h3>

        <div class="field">
          <label class="field-label">Pseudo</label>
          <div class="input-wrap">
            <User :size="18" color="#888" />
            <input v-model="form.pseudo" type="text" placeholder="Pseudo" />
          </div>
        </div>

        <div class="field">
          <label class="field-label">Prénom</label>
          <div class="input-wrap">
            <User :size="18" color="#888" />
            <input v-model="form.prenom" type="text" placeholder="Prénom" />
          </div>
        </div>

        <div class="field">
          <label class="field-label">Nom</label>
          <div class="input-wrap">
            <User :size="18" color="#888" />
            <input v-model="form.nom" type="text" placeholder="Nom" />
          </div>
        </div>

        <div class="field">
          <label class="field-label">Email</label>
          <div class="input-wrap">
            <Mail :size="18" color="#888" />
            <input v-model="form.email" type="email" placeholder="Email" />
          </div>
        </div>
      </div>

      <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

      <!-- Save -->
      <button class="btn-save" :disabled="saving" @click="handleSave">
        <Save :size="18" />
        {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
      </button>

    </div>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  background: #f4f4f4;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem;
}

.edit-card {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn-back {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #e5e5e5;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  transition: all 0.2s ease;
}

.btn-back:hover {
  border-color: #FAC12D;
}

.page-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.avatar {
  position: relative;
  width: 88px;
  height: 88px;
  cursor: pointer;
}

.avatar-img {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  border: 3px solid #FAC12D;
  object-fit: cover;
}

.avatar-placeholder {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  border: 3px solid #FAC12D;
  background: #fff8e1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  font-weight: 800;
  color: #FAC12D;
}

.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #FAC12D;
  border: 2px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.avatar-hint {
  font-size: 0.8rem;
  color: #888888;
  margin: 0;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.section-title {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #888888;
  margin: 0 0 0.25rem 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #444444;
}

.input-wrap {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: #f9f9f9;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 0.65rem 0.85rem;
  transition: border-color 0.2s ease;
}

.input-wrap:focus-within {
  border-color: #FAC12D;
  background: #fffdf5;
}

.input-wrap input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  color: #1a1a1a;
  outline: none;
  min-width: 0;
}

.input-wrap input::placeholder {
  color: #bbbbbb;
}

.error-msg {
  font-size: 0.85rem;
  color: #e53e3e;
  text-align: center;
  margin: 0;
}

.btn-save {
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  border: none;
  background: #FAC12D;
  color: #000000;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(250, 193, 45, 0.4);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-save:not(:disabled):hover {
  background: #e6ad28;
  box-shadow: 0 6px 16px rgba(250, 193, 45, 0.5);
}
</style>
