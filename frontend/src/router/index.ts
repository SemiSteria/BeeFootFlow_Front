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
      component: () => import('../views/MatchmakingView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
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

export default router
