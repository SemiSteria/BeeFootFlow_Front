import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'firstpage',
      component: () => import('../views/FirstPageView.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('../views/AuthCallbackView.vue')
    },
    {
      path: '/matchmaking',
      name: 'matchmaking',
      component: () => import('../views/MatchmakingView.vue'),
      children: [
        {
          path: 'find',
          name: 'matchmaking-find',
          component: () => import('../components/Matchmaking/FindMatchTab.vue')
        },
        {
          path: 'join',
          name: 'matchmaking-join',
          component: () => import('../components/Matchmaking/JoinGameTab.vue')
        }
      ]
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/profile/edit',
      name: 'profile-edit',
      component: () => import('../views/EditProfil.vue')
    },
    {
      path: '/teams/create',
      name: 'create-team',
      component: () => import('../views/CreateTeamView.vue')
    },
    {
      path: '/score',
      name: 'score',
      component: () => import('../views/ScorePageView.vue')
    }
  ]
})

// Authentication Guard
router.beforeEach((to, _from, next) => {
  const publicPages = ['/', '/auth/callback'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user_data');

  // Skip redirect loop
  if (to.path === '/' && loggedIn) {
    return next('/home');
  }

  if (authRequired && !loggedIn) {
    return next('/');
  }

  next();
})

export default router
