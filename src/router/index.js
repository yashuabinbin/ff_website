import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login.vue'
import index from '../components/index.vue'
import payInfoManage from '../components/payInfoManage.vue'
import contractManage from '../components/contractManage.vue'
import subContractorManage from '../components/subContractorManage.vue'
import invoiceInfoManage from '../components/invoiceInfoManage.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/index',
      component: index,
      children: [
        {
          path: '/contractManage',
          component: contractManage
        },
        {
          path: '/subContractorManage',
          component: subContractorManage
        },
        {
          path: '/payInfoManage',
          component: payInfoManage
        },
        {
          path: '/invoiceInfoManage',
          component: invoiceInfoManage
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    let token = localStorage.getItem('TOKEN')
    if (!token) {
      next('/login')
    } else {
      next()
    }
  }
})

export default router
