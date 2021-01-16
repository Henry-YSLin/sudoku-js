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
        pageTitle: 'Home',
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
    }
  ]
})

export default router;