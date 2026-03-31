<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Home } from 'lucide-vue-next';

const router = useRouter();
</script>

<template>
  <div class="container">
    <div class="card">
      <div class="code">
        <span class="digit">4</span>
        <span class="ball">⚽</span>
        <span class="digit">4</span>
      </div>
      <div class="divider"></div>
      <h1 class="title">Page introuvable</h1>
      <p class="subtitle">La page que tu cherches n'existe pas ou a été déplacée.</p>
      <button class="btn-home" @click="router.push('/home')">
        <Home :size="18" />
        Retour à l'accueil
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

.card {
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 24px;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  animation: fadeUp 0.5s ease both;
}

.code {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  line-height: 1;
}

.digit {
  font-size: 6rem;
  font-weight: 900;
  color: #FAC12D;
  letter-spacing: -4px;
  animation: fadeUp 0.5s ease both;
}

.digit:last-child {
  animation-delay: 0.3s;
  opacity: 0;
  animation-fill-mode: forwards;
}

.ball {
  font-size: 4rem;
  animation: bounce 0.9s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite alternate,
             fadeUp 0.5s ease 0.15s both;
  display: inline-block;
  transform-origin: bottom center;
}

.divider {
  width: 0;
  height: 4px;
  border-radius: 9999px;
  background: #FAC12D;
  animation: expand 0.5s ease 0.5s both;
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  opacity: 0;
  animation: fadeUp 0.4s ease 0.55s both;
}

.subtitle {
  font-size: 0.9rem;
  color: #888888;
  text-align: center;
  margin: 0;
  opacity: 0;
  animation: fadeUp 0.4s ease 0.65s both;
}

.btn-home {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.75rem;
  border-radius: 12px;
  border: none;
  background: #FAC12D;
  color: #000000;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(250, 193, 45, 0.4);
  opacity: 0;
  animation: fadeUp 0.4s ease 0.75s both;
}

.btn-home:hover {
  background: #e6ad28;
  box-shadow: 0 6px 16px rgba(250, 193, 45, 0.5);
  transform: translateY(-2px);
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes expand {
  from { width: 0; }
  to   { width: 48px; }
}

@keyframes bounce {
  from { transform: translateY(0px) rotate(-5deg); }
  to   { transform: translateY(-18px) rotate(5deg); }
}
</style>
