import { createRouter, createWebHistory } from 'vue-router'
import TestRebuild from '../views/TestRebuild.vue'
import PartieEnglish from '../views/PartieEnglish.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path : '/partiefr/:id/:joueur',
      component: TestRebuild
    },
    {
      path: '/partieen/:id/:joueur',
      component: PartieEnglish
    },
  ]
})

export default router
