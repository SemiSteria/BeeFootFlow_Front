<template>
  <main class="matchmaking-view">
    <div class="header">
      <h1>Matchmaking</h1>
      <p>Trouvez votre équipe pour le prochain match.</p>
    </div>

    <div class="search-section">
      <input type="text" placeholder="Rechercher un joueur..." class="search-input">
      <button class="search-btn">Rechercher</button>
    </div>

    <div class="teams-grid">
      <div class="team-card" v-for="team in teams" :key="team.name">
        <div class="team-header">
          <span class="team-name">{{ team.name }}</span>
          <span class="team-players">{{ team.players }}/10</span>
        </div>
        <div class="team-footer">
          <span class="team-level">Niveau: {{ team.level }}</span>
          <button class="join-btn">Rejoindre</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
const teams = [
  { name: "Team Les Bleus", players: 8, level: "Intermédiaire" },
  { name: "FC Paname", players: 5, level: "Pro" },
  { name: "Dream Team", players: 9, level: "Amateur" },
  { name: "Team Marseille", players: 2, level: "Débutant" }
]
</script>

<style scoped>
.matchmaking-view {
  padding: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
}

.header {
  margin-bottom: 2rem;
}

h1 {
  font-size: 1.75rem;
  color: #d4892a;
  margin-bottom: 0.5rem;
}

p {
  color: #666;
}

.search-section {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.search-input {
  flex: 1;
  padding: 0.8rem 1.2rem;
  border: 1px solid #e0dde8;
  border-radius: 0.75rem;
  font-family: inherit;
}

.search-btn {
  padding: 0.8rem 1.5rem;
  background-color: #d4892a;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

.teams-grid {
  display: grid;
  gap: 1rem;
}

.team-card {
  background: white;
  padding: 1.25rem;
  border-radius: 1rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
}

.team-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.team-name {
  font-weight: 700;
  color: #333;
}

.team-players {
  font-size: 0.85rem;
  color: #888;
}

.team-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.team-level {
  font-size: 0.85rem;
  color: #666;
}

.join-btn {
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border: 1px solid #e0dde8;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.join-btn:hover {
  background: #d4892a;
  color: white;
  border-color: #d4892a;
}
@media (min-width: 640px) {
  .matchmaking-view {
    max-width: 720px;
  }
  
  .teams-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .matchmaking-view {
    padding: 1.25rem 1rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  .search-section {
    flex-direction: column;
  }
  
  .team-card {
    padding: 1rem;
  }
}
</style>
