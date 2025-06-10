import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/views/LandingPage.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginPage.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterPage.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard-home',
          component: () => import('@/views/dashboard/DashboardHome.vue')
        },
        {
          path: 'companies',
          name: 'companies',
          component: () => import('@/views/dashboard/CompaniesPage.vue')
        },
        {
          path: 'companies/new',
          name: 'company-create',
          component: () => import('@/views/dashboard/CreateCompanyPage.vue')
        },
        {
          path: 'companies/:id/edit',
          name: 'company-edit',
          component: () => import('@/views/dashboard/CreateCompanyPage.vue'),
          props: true
        },
        {
          path: 'posts',
          name: 'posts',
          component: () => import('@/views/dashboard/PostsPage.vue')
        },
        {
          path: 'posts/new',
          name: 'post-create',
          component: () => import('@/views/dashboard/PostsPage.vue')
        },
        {
          path: 'posts/:id/edit',
          name: 'post-edit',
          component: () => import('@/views/dashboard/PostsPage.vue'),
          props: true
        },
        {
          path: 'generate',
          name: 'ai-generate',
          component: () => import('@/views/dashboard/AIGenerationPage.vue')
        },
        {
          path: 'analytics',
          name: 'analytics',
          component: () => import('@/views/dashboard/AnalyticsPage.vue')
        },
        {
          path: 'templates',
          name: 'templates',
          component: () => import('@/views/dashboard/TemplatesPage.vue')
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/dashboard/SettingsPage.vue')
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/dashboard/ProfilePage.vue')
        }
      ]
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/AdminLayout.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/AdminDashboard.vue')
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('@/views/admin/UsersManagement.vue')
        },
        {
          path: 'analytics',
          name: 'admin-analytics',
          component: () => import('@/views/admin/AdminAnalytics.vue')
        },
        {
          path: 'settings',
          name: 'admin-settings',
          component: () => import('@/views/admin/AdminSettings.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundPage.vue')
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // Initialize user data if not already done
  if (!userStore.isAuthenticated) {
    userStore.initializeUser()
  }

  // Check authentication requirements
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  // Check admin requirements
  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    next({ name: 'dashboard-home' })
    return
  }

  // Redirect authenticated users away from guest-only pages
  if (to.meta.requiresGuest && userStore.isAuthenticated) {
    next({ name: 'dashboard-home' })
    return
  }

  next()
})

export default router