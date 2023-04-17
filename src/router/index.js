import { createRouter, createWebHistory } from 'vue-router'
import TestRebuild from '../views/TestRebuild.vue'
import PartieEnglish from '../views/PartieEnglish.vue'
import Home from '../views/Home.vue'
import Test from '../views/Test.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path : '/partiefr/:id/:joueur',
      component: TestRebuild
    },
    {
      path: '/partieen/:id/:joueur',
      component: PartieEnglish
    },
    {
      path: '/test',
      component: Test
    }
  ]
})




export default router
