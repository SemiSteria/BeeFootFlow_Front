<script setup lang="ts">
// FindMatchTab is currently empty as requested.
</script>

<template>
  <div class="find-match-tab">
    <!-- Contenu à venir -->
    <div class="empty-placeholder">
      <p>Système de matchmaking en cours de développement...</p>
    </div>
  </div>
</template>

<style scoped>
.find-match-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  animation: fadeIn 0.4s ease-out;
}

.empty-placeholder {
  text-align: center;
  color: #94A3B8;
  font-weight: 600;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
