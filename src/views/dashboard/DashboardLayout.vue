<template>
  <div class="min-h-screen bg-secondary-50 dark:bg-secondary-950 flex">
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-secondary-900 border-r border-secondary-200 dark:border-secondary-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0"
      :class="{ '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen }">
      <!-- Logo -->
      <div class="flex items-center justify-between h-16 px-6 border-b border-secondary-200 dark:border-secondary-700">
        <router-link to="/dashboard" class="flex items-center space-x-2">
          <span class="text-xl font-bold gradient-ai-text">Aiva</span>
        </router-link>

        <button @click="sidebarOpen = false"
          class="lg:hidden p-1 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-800">
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>

      <!-- Company Selector -->
      <div class="p-4 border-b border-secondary-200 dark:border-secondary-700">
        <CompanySelector />
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-2 custom-scrollbar overflow-y-auto">
        <SidebarLink v-for="item in navigationItems" :key="item.name" :to="item.to" :icon="item.icon" :name="item.name"
          :badge="item.badge" />
      </nav>

      <!-- User Menu -->
      <div class="p-4 border-t border-secondary-200 dark:border-secondary-700">
        <UserMenu />
      </div>
    </aside>

    <!-- Mobile sidebar overlay -->
    <div v-if="sidebarOpen" class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" @click="sidebarOpen = false">
    </div>

    <!-- Main Content -->
    <div class="flex-1 lg:ml-0">
      <!-- Top Bar -->
      <header class="bg-white dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-700 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button @click="sidebarOpen = true"
              class="lg:hidden p-2 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-800">
              <Bars3Icon class="w-5 h-5" />
            </button>

            <div>
              <h1 class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                {{ pageTitle }}
              </h1>
              <p v-if="pageDescription" class="text-sm text-secondary-600 dark:text-secondary-400">
                {{ pageDescription }}
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Quick Actions -->
            <router-link to="/dashboard/generate" class="btn-primary hidden sm:inline-flex items-center space-x-2">
              <SparklesIcon class="w-4 h-4" />
              <span>Generate Content</span>
            </router-link>

            <!-- Notifications -->
            <button class="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 relative">
              <BellIcon class="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              <span class="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full"></span>
            </button>

            <!-- Theme Toggle -->
            <ThemeToggle />
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useCompanyStore } from '@/stores/company'
import { usePostsStore } from '@/stores/posts'
import SidebarLink from '@/components/dashboard/SidebarLink.vue'
import CompanySelector from '@/components/dashboard/CompanySelector.vue'
import UserMenu from '@/components/dashboard/UserMenu.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import {
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  SparklesIcon,
  HomeIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  DocumentDuplicateIcon,
  Cog6ToothIcon,
  UserIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const userStore = useUserStore()
const companyStore = useCompanyStore()
const postsStore = usePostsStore()

const sidebarOpen = ref(false)

// Initialize stores
onMounted(() => {
  companyStore.initializeCompanies()
  postsStore.initializePosts()
})

const navigationItems = computed(() => [
  {
    name: 'Dashboard',
    to: '/dashboard',
    icon: HomeIcon
  },
  {
    name: 'Companies',
    to: '/dashboard/companies',
    icon: BuildingOfficeIcon,
    badge: companyStore.userCompanies.length || undefined
  },
  {
    name: 'Posts',
    to: '/dashboard/posts',
    icon: DocumentTextIcon,
    badge: postsStore.currentCompanyPosts.length || undefined
  },
  {
    name: 'AI Generator',
    to: '/dashboard/generate',
    icon: SparklesIcon
  },
  {
    name: 'Analytics',
    to: '/dashboard/analytics',
    icon: ChartBarIcon
  },
  {
    name: 'Templates',
    to: '/dashboard/templates',
    icon: DocumentDuplicateIcon
  },
  {
    name: 'Settings',
    to: '/dashboard/settings',
    icon: Cog6ToothIcon
  },
  {
    name: 'Profile',
    to: '/dashboard/profile',
    icon: UserIcon
  }
])

const pageTitle = computed(() => {
  const routeNames: Record<string, string> = {
    'dashboard-home': 'Dashboard',
    'companies': 'Companies',
    'company-create': 'Create Company',
    'company-edit': 'Edit Company',
    'posts': 'Posts',
    'post-create': 'Create Post',
    'post-edit': 'Edit Post',
    'ai-generate': 'AI Generator',
    'analytics': 'Analytics',
    'templates': 'Templates',
    'settings': 'Settings',
    'profile': 'Profile'
  }

  return routeNames[route.name as string] || 'Dashboard'
})

const pageDescription = computed(() => {
  const descriptions: Record<string, string> = {
    'dashboard-home': 'Overview of your social media performance',
    'companies': 'Manage your company profiles and settings',
    'company-create': 'Add a new company to your account',
    'company-edit': 'Update company information and settings',
    'posts': 'View and manage your social media posts',
    'post-create': 'Create a new social media post',
    'post-edit': 'Edit your social media post',
    'ai-generate': 'Generate content with AI assistance',
    'analytics': 'Track your social media performance',
    'templates': 'Manage your content templates',
    'settings': 'Configure your account preferences',
    'profile': 'Manage your personal information'
  }

  return descriptions[route.name as string]
})
</script>