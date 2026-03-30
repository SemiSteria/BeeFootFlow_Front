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
      path: '/matchmaking',
      name: 'matchmaking',
      component: () => import('../views/MatchmakingView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    }
  ]
})

export default router
