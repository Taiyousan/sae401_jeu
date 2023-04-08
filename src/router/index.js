import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'
import Home from '../views/Home.vue'
import Jeu from '../views/Jeu.vue'
import PartieSaved from '../views/PartieSaved.vue'
import Prototype from '../views/Prototype.vue'
import PdvJoueur from '../views/PdvJoueur.vue'
import TestPartie from '../views/TestPartie.vue'
import TestRebuild from '../views/TestRebuild.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path : '/',
      component: PdvJoueur
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
      component: Home
    },
    {
      path: '/testpartie',
      component: TestPartie
    },
    {
      path: '/testrebuild/:id/:joueur',
      component: TestRebuild
    }
  ]
})

export default router
