import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    component: () => import('@/components/AppShell.vue'),
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', name: 'dashboard', component: () => import('@/views/Dashboard.vue') },
      { path: 'server', name: 'server', component: () => import('@/views/Server.vue') },
      { path: 'clients', name: 'clients', component: () => import('@/views/Clients.vue') },
      { path: 'endpoints', name: 'endpoints', component: () => import('@/views/Endpoints.vue') },
      { path: 'tokens', name: 'tokens', component: () => import('@/views/Tokens.vue') }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async to => {
  if (to.meta.public) return true
  const auth = useAuthStore()
  if (!auth.ready) await auth.refresh()
  if (!auth.isAuthed) return { name: 'login', query: { redirect: to.fullPath } }
  return true
})

export default router
