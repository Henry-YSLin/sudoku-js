import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/Home.vue'),
      meta: {
        pageTitle: 'Choose an action',
        backAction: false
      },
    },
    {
      path: '/manual-input',
      name: 'manual-input',
      component: () => import('@/pages/ManualInput.vue'),
      meta: {
        pageTitle: 'Manual input',
        backAction: true
      },
    },
    {
      path: '/generate',
      name: 'generate',
      component: () => import('@/pages/Generate.vue'),
      meta: {
        pageTitle: 'Generate',
        backAction: true
      },
    },
    {
      path: '/save-load',
      name: 'save-load',
      component: () => import('@/pages/SaveLoad.vue'),
      meta: {
        pageTitle: 'Save/Load Code',
        backAction: true
      },
    },
    {
      path: '/solve',
      name: 'solve',
      component: () => import('@/pages/Solve.vue'),
      meta: {
        pageTitle: 'Solve',
        backAction: true
      },
    },
    {
      path: '/play',
      name: 'play',
      component: () => import('@/pages/Play.vue'),
      meta: {
        pageTitle: 'Play',
        backAction: true
      },
    },
    {
      path: '/analyze',
      name: 'analyze',
      component: () => import('@/pages/Analyze.vue'),
      meta: {
        pageTitle: 'Analyze',
        backAction: true
      },
    },
  ]
})

export default router;