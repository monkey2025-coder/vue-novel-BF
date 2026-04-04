import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    redirect: '/about/info',
    children: [
      {
        path: 'info',
        name: 'aboutInfo',
        component: () => import('@/views/AboutSub/AboutInfo.vue')
      },
      {
        path: 'us',
        name: 'aboutUs',
        component: () => import('@/views/AboutSub/AboutUs.vue')
      },
    ]
  },
  // 异步加载 除了首页之外，最好都是这样异步加载进来
  {
    path: '/news',
    name: 'news',
    component: () => import('@/views/News.vue')
  },
  {
    path: '/news/:id',
    name: 'newsDetails',
    component: () => import('@/views/NewsDetails.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

export default router
