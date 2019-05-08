import Vue from 'vue'
import Router from 'vue-router'
import Home from '@v/Home.vue'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      meta: {
        keepAlive: false
      },
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '@v/about/about.vue')
    },
    {
      path: '*',
      redirect: '/404'
    },
    {
      path: '/404',
      name: 'noPage',
      meta: {
        title: 'page not found'
      },
      component: () =>
        import(/* webpackChunkName: "noPage" */ '@v/error-page/noPage.vue')
    },
    {
      path: '/500',
      name: 'errPage',
      meta: {
        title: 'request failed, please try again later'
      },
      component: () => import(/* webpackChunkName: "errPage" */ '@v/error-page/errPage.vue')
    }
  ]
})

router.afterEach((to, from, next) => {
  document.title = to.meta.title || process.env.VUE_APP_TITLE
})

export default router
