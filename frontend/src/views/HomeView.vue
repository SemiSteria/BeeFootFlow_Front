<script setup>
import { ref } from 'vue'

// L'objet user sera alimenté directement depuis la BDD (via une API future)
// On utilise les noms exacts du modèle Prisma 'users'
const user = ref({
  userName: 'Felix',
  totalMatchs: 12,
  totalWins: 5
})
</script>

<template>
  <main class="home-view">
    <header class="home-header">
      <div class="brand-section">
        <img src="/favicon.svg" alt="BeeFootFlow Logo" class="brand-logo" />
        <div class="brand-text">
          <h1>BeeFoot<span>Flow</span></h1>
          <p>L'élite du baby-foot entre vos mains.</p>
        </div>
      </div>
      <div class="user-profile">
        <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.userName}`" alt="Profile" />
      </div>
    </header>

    <div class="stats-container">
      <div class="stat-card">
        <div class="stat-info">
          <!-- Mapping avec le champ Prisma 'totalMatchs' -->
          <span class="stat-val">{{ user.totalMatchs }}</span>
          <span class="stat-lab">MESSES</span>
        </div>
        <div class="stat-icon pulse">⚽</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-info">
          <!-- Mapping avec le champ Prisma 'totalWins' -->
          <span class="stat-val">{{ user.totalWins.toString().padStart(2, '0') }}</span>
          <span class="stat-lab">WINS</span>
        </div>
        <div class="stat-icon">🏆</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-info">
          <!-- Calcul dynamique de l'accuracy sans stocker la variable -->
          <span class="stat-val">
            {{ user.totalMatchs > 0 ? Math.round((user.totalWins / user.totalMatchs) * 100) : 0 }}%
          </span>
          <span class="stat-lab">ACC.</span>
        </div>
        <div class="stat-icon">⚡</div>
      </div>
    </div>

    <section class="next-match-section">
      <div class="section-title">
        <h2>NEXT MATCH</h2>
        <span class="live-indicator">LIVE SOON</span>
      </div>
      
      <div class="match-glass-card">
        <div class="team-side">
          <div class="team-logo">A</div>
          <span>Team Alpha</span>
        </div>
        <div class="match-center">
          <span class="vs-text">VS</span>
          <div class="match-time">19:00</div>
        </div>
        <div class="team-side">
          <div class="team-logo b">B</div>
          <span>Team Bravo</span>
        </div>
      </div>
    </section>

    <section class="rules-kb-section">
      <div class="section-title">
        <h2>LES RÈGLES DE L'ART</h2>
        <span class="badge-volt">OFFICIEL FFFT</span>
      </div>

      <div class="rules-grid">
        <div class="kb-item">
          <div class="kb-header">
            <span class="kb-num">01</span>
            <h3>Structure du Match</h3>
          </div>
          <p>Un match se joue au meilleur des <strong>5 manches</strong>. Chaque manche se gagne en <strong>5 points</strong>. En cas d'égalité à 4-4 dans la dernière manche, il faut 2 points d'écart.</p>
        </div>

        <div class="kb-item">
          <div class="kb-header">
            <span class="kb-num">02</span>
            <h3>Service & Engagement</h3>
          </div>
          <p>Le service se fait toujours aux <strong>demis</strong> (milieux). Vous devez demander <strong>« Prêt ? »</strong> et attendre la réponse. La balle doit être arrêtée sous le joueur central avant de démarrer.</p>
        </div>

        <div class="kb-item">
          <div class="kb-header">
            <span class="kb-num">03</span>
            <h3>Ce qui est Autorisé</h3>
          </div>
          <p>Contrairement aux règles de bar, la <strong>pissette</strong> (tir de l'ailier avant) est 100% autorisée. Les buts marqués avec les <strong>demis</strong> comptent également.</p>
        </div>

        <div class="kb-item">
          <div class="kb-header">
            <span class="kb-num">04</span>
            <h3>Ce qui est Interdit</h3>
          </div>
          <p>La <strong>roulette</strong> est interdite (pas plus d'un tour complet avant/après la frappe). Il est également interdit de faire vibrer le tapis ou de gêner l'adversaire physiquement.</p>
        </div>

        <div class="kb-item">
          <div class="kb-header">
            <span class="kb-num">05</span>
            <h3>Cas Particuliers</h3>
          </div>
          <p>Une <strong>gamelle</strong> (balle qui entre et ressort du but) ne vaut qu'<strong>un seul point</strong>. Si la balle sort de la table, elle est remise en jeu à l'arrière pour l'équipe qui n'a pas tiré.</p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home-view {
  padding: 2.5rem 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  color: var(--text-main);
}

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3.5rem;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.brand-logo {
  width: 52px;
  height: 52px;
  object-fit: contain;
}

.brand-text h1 {
  font-size: 2.2rem;
  font-weight: 950;
  margin: 0;
  letter-spacing: -2px;
  text-transform: uppercase;
  color: #000;
  line-height: 1;
}

.brand-text h1 span {
  color: var(--primary);
}

.brand-text p {
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0.3rem 0 0;
}

.user-profile img {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  background: white;
  border: 2px solid #EEE;
  padding: 2px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

/* Stats */
.stats-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 3.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem 1rem;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid #EDEDED;
  box-shadow: 0 10px 25px rgba(0,0,0,0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-8px);
  border-color: #DDD;
  box-shadow: 0 15px 35px rgba(0,0,0,0.05);
}

.stat-val {
  font-size: 1.6rem;
  font-weight: 950;
  color: var(--text-main);
}

.stat-lab {
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--primary);
  letter-spacing: 1.5px;
}

.stat-icon {
  font-size: 1.3rem;
  background: var(--surface);
  padding: 0.5rem;
  border-radius: 12px;
}

.pulse {
  animation: pulse-border 2.5s infinite;
}

@keyframes pulse-border {
  0% { box-shadow: 0 0 0 0 rgba(250, 193, 45, 0.4); }
  70% { box-shadow: 0 0 0 12px rgba(250, 193, 45, 0); }
  100% { box-shadow: 0 0 0 0 rgba(250, 193, 45, 0); }
}

/* Sections */
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title h2 {
  font-size: 0.9rem;
  font-weight: 900;
  letter-spacing: 2px;
  color: var(--text-main);
  text-transform: uppercase;
  margin: 0;
}

.live-indicator {
  font-size: 0.65rem;
  background: #000;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 30px;
  font-weight: 900;
  letter-spacing: 1px;
}

/* Match Card */
.match-glass-card {
  background: linear-gradient(145deg, #ffffff, #fdfdfd);
  border: 1px solid #EDEDED;
  border-radius: 28px;
  padding: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.03);
}

.team-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 110px;
}

.team-logo {
  width: 68px;
  height: 68px;
  background: var(--primary);
  color: #000;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 900;
  box-shadow: 0 10px 20px var(--accent-glow);
}

.team-logo.b {
  background: #1A1D23;
  color: white;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.team-side span {
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--text-main);
}

.match-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

.vs-text {
  font-size: 1.4rem;
  font-weight: 950;
  color: #E2E8F0;
}

.match-time {
  background: #1A1D23;
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 800;
}

/* Rules Grid */
.rules-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.kb-item {
  background: white;
  padding: 1.75rem;
  border-radius: 24px;
  border: 1px solid #EDEDED;
  transition: all 0.25s ease;
}

.kb-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.kb-num {
  font-size: 0.8rem;
  font-weight: 950;
  color: var(--primary);
  background: var(--surface);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.kb-header h3 {
  font-size: 1.1rem;
  margin: 0;
  font-weight: 850;
  color: var(--text-main);
}

.kb-item p {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0;
}

.badge-volt {
  font-size: 0.7rem;
  background: var(--primary);
  color: #000;
  padding: 0.3rem 1rem;
  border-radius: 30px;
  font-weight: 900;
  box-shadow: 0 4px 12px var(--accent-glow);
}
@media (max-width: 600px) {
  .home-view {
    padding: 1.5rem 1rem;
  }
  
  .brand-text h1 {
    font-size: 1.8rem;
  }
  
  .brand-logo {
    width: 42px;
    height: 42px;
  }
  
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-container .stat-card:last-child {
    grid-column: span 2;
  }
  
  .match-glass-card {
    padding: 1.5rem;
    flex-direction: column;
    gap: 2rem;
  }
  
  .team-side {
    width: 100%;
    flex-direction: row;
    justify-content: center;
  }
  
  .match-center {
    flex-direction: row;
    gap: 1rem;
  }
  
  .vs-text {
    font-size: 1.1rem;
  }
  
  .rules-grid {
    gap: 1rem;
  }
  
  .kb-item {
    padding: 1.25rem;
  }
}
</style>
