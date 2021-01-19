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
        pageTitle: 'Get a Sudoku',
        confirmAction: false,
        backAction: false
      },
    },
    {
      path: '/manual-input',
      name: 'manual-input',
      component: () => import('@/pages/ManualInput.vue'),
      meta: {
        pageTitle: 'Manual input',
        confirmAction: true,
        backAction: true
      },
    },
    {
      path: '/generate',
      name: 'generate',
      component: () => import('@/pages/Generate.vue'),
      meta: {
        pageTitle: 'Generate',
        confirmAction: true,
        backAction: true
      },
    },
    {
      path: '/load',
      name: 'load',
      component: () => import('@/pages/Load.vue'),
      meta: {
        pageTitle: 'Load',
        confirmAction: true,
        backAction: true
      },
    },
    {
      path: '/action',
      name: 'action',
      component: () => import('@/pages/Action.vue'),
      meta: {
        pageTitle: 'Choose an action',
        confirmAction: false,
        backAction: true
      },
    },
    {
      path: '/solve',
      name: 'solve',
      component: () => import('@/pages/Solve.vue'),
      meta: {
        pageTitle: 'Solve',
        confirmAction: false,
        backAction: true
      },
    },
  ]
})

export default router;