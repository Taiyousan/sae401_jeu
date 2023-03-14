import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'
import Home from '../views/Home.vue'
import Jeu from '../views/Jeu.vue'
import PartieSaved from '../views/PartieSaved.vue'
import Prototype from '../views/Prototype.vue'
import PdvJoueur from '../views/PdvJoueur.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path : '/',
      component: Home
    },
    {
      path: '/jeu',
      component: Jeu
    },
    {
      path: '/partiesaved',
      component: PartieSaved
    },
    {
      path: '/prototype',
      component: Prototype
    },
    {
      path: '/pdvjoueur',
      component: PdvJoueur
    }
  ]
})

export default router
