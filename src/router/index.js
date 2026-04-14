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
    path: '/create-outline',
    name: 'createOutline',
    component: () => import('@/views/CreateOutline.vue')
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
    path: '/outline/:id',
    name: 'outlineDetails',
    component: () => import('@/views/OutlineDetails.vue')
  },
  {
    path: '/chapters/:id',
    name: 'chapterDetails',
    component: () => import('@/views/chapters.vue')
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: () => import('@/views/TaskManager.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

export default router
