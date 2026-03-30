# BeeFootFlow - Système d'Analyse Connecté pour Baby-Foot

[![Challenge](https://img.shields.io/badge/Challenge-48h--Ynov-blue?style=for-the-badge)](https://www.ynov.com)
[![Stack](https://img.shields.io/badge/Stack-TypeScript%20|%20Vue.js%203%20|%20Node.js-green?style=for-the-badge)](/)

> Transformez votre baby-foot classique en un objet connecté de haute précision. Suivez vos scores, analysez la vitesse de vos tirs et grimpez dans le classement mondial.

---

## Présentation du Projet

**BeeFootFlow** est une solution IoT complète conçue pour digitaliser l'expérience du baby-foot. Grâce à des capteurs ultrasons et une plateforme web moderne, chaque partie devient une mine de données pour les joueurs compétitifs.

### Objectifs principaux :
- **Détection automatique des scores** sans intervention humaine.
- **Calcul de la vitesse de la balle** en temps réel pour chaque but.
- **Gestion d'un classement compétitif** (ELO/MMR) via une application web dédiée.

---

## Architecture Technique (Stack)

Le projet repose sur une stack moderne, robuste et scalable :

### Hardware & IoT
- **Capteurs** : 2× capteurs ultrasons (HC-SR04) placés stratégiquement dans chaque but.
- **Microcontrôleur** : **ESP32** (pour sa connectivité Wi-Fi native et sa puissance de calcul).
- **Protocole** : **MQTT** (pour une latence minimale) ou **HTTP**.

### Logiciel (Développement Fullstack)
- **Langage** : TypeScript (Uniformité sur tout le projet).
- **Backend** : Node.js avec Express.
- **Frontend** : Vue.js 3 (Composition API) + Tailwind CSS pour un dashboard fluide et réactif.
- **Bases de données** :
  - **PostgreSQL** : Données relationnelles (Utilisateurs, Matchs, Rankings).
  - **InfluxDB** : Séries temporelles pour l'analyse fine des vitesses de balle.

### Infrastructure & CI/CD
- **Hébergement** : Machine Virtuelle (VM).
- **Orchestration** : **K3s** (Lightweight Kubernetes) pour une résilience maximale.
- **CI/CD** : Déploiement automatisé via Docker sur le cluster.

---

## Spécifications Fonctionnelles

### UX & Gestion des Matchs
1. **Initialisation** : Le dashboard physique affiche un QR Code unique.
2. **Connexion** : Les joueurs scannent le QR Code pour rejoindre l'Équipe A ou B.
3. **Ranking** : Mise à jour automatique du MMR à la fin de chaque match selon les performances.

### Métriques Collectées (Match Data)
| Métrique | Description |
| :--- | :--- |
| **Identification** | Composition complète des équipes. |
| **Score** | Évolution en temps réel (Push notifications). |
| **Chronométrie** | Temps total et temps "but-à-but". |
| **Performance** | Vitesse instantanée et moyenne de la balle. |
| **Équilibrage** | Pondération du gain de MMR basée sur l'Elo moyen de la partie. |

---

## Analyse de la Donnée IoT

Le système de détection repose sur une boucle haute fréquence :

1. **Détection de présence** : Passage de la balle devant le capteur ultra-son.
2. **Calcul de vitesse** :
   - *Méthode préférée* : Utilisation d'un second capteur pour mesurer le temps de passage entre deux points précis.
   - *Alternative* : Calcul basé sur la variation de distance (delta de détection) ou le temps d'obstruction du faisceau.
3. **Filtrage** : Algorithme anti-faux positifs pour ignorer les vibrations ou la main d'un joueur récupérant la balle.

---

## Structure de la Base de Données

| Table | Description |
| :--- | :--- |
| `Users` | ID, Pseudo, Password, MMR, Stats globales. |
| `Matches` | ID, Team_A_IDs, Team_B_IDs, Final_Score, Duration, Created_at. |
| `Goals` | Match_ID, Timestamp, Scorer_ID, Ball_Speed. |

---

## Points de Vigilance

### Calcul de la vitesse
Avec un seul capteur, la précision du calcul de vitesse est limitée. Nous envisageons l'ajout d'un second point de mesure pour garantir une donnée fiable et indiscutable pour la compétition.

### Authentification & Accès
Le scan du QR Code redirige vers une **PWA (Progressive Web App)** :
- **Login requis** pour les matchs officiels (Update MMR).
- **Mode Invité** disponible pour des parties rapides sans impact sur le classement.

---

*Projet réalisé dans le cadre du Challenge 48h Semisteria.*