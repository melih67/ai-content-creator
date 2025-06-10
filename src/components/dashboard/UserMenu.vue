<template>
  <div class="relative">
    <button @click="isOpen = !isOpen"
      class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors duration-200">
      <div
        class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
        <span class="text-white font-semibold text-sm">
          {{ userInitials }}
        </span>
      </div>
      <div class="min-w-0 flex-1 text-left">
        <p class="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">
          {{ userFullName }}
        </p>
        <p class="text-xs text-secondary-500 dark:text-secondary-400 truncate">
          {{ currentUser?.email }}
        </p>
      </div>
      <ChevronUpIcon class="w-4 h-4 text-secondary-500 dark:text-secondary-400 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }" />
    </button>

    <!-- Dropdown Menu -->
    <Transition enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95 translate-y-2" enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-2">
      <div v-if="isOpen"
        class="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg shadow-lg z-50">
        <div class="p-2">
          <!-- Profile Link -->
          <router-link to="/dashboard/profile" @click="isOpen = false"
            class="w-full flex items-center space-x-3 p-2 rounded-md text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors duration-200">
            <UserIcon class="w-4 h-4" />
            <span>Profile Settings</span>
          </router-link>

          <!-- Settings Link -->
          <router-link to="/dashboard/settings" @click="isOpen = false"
            class="w-full flex items-center space-x-3 p-2 rounded-md text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors duration-200">
            <Cog6ToothIcon class="w-4 h-4" />
            <span>Account Settings</span>
          </router-link>

          <!-- Admin Link (if admin) -->
          <router-link v-if="isAdmin" to="/admin" @click="isOpen = false"
            class="w-full flex items-center space-x-3 p-2 rounded-md text-sm font-medium text-accent-700 dark:text-accent-300 hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-colors duration-200">
            <ShieldCheckIcon class="w-4 h-4" />
            <span>Admin Panel</span>
          </router-link>

          <!-- Subscription Info -->
          <div class="px-2 py-3 border-t border-secondary-200 dark:border-secondary-700 mt-2">
            <div class="flex items-center justify-between">
              <span class="text-xs text-secondary-500 dark:text-secondary-400">Plan</span>
              <span class="text-xs font-medium px-2 py-1 rounded-full" :class="subscriptionBadgeClass">
                {{ currentUser?.subscription || 'Free' }}
              </span>
            </div>
          </div>

          <!-- Logout -->
          <button @click="handleLogout"
            class="w-full flex items-center space-x-3 p-2 rounded-md text-sm font-medium text-error-700 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors duration-200 mt-2">
            <ArrowRightOnRectangleIcon class="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Click outside to close -->
    <div v-if="isOpen" class="fixed inset-0 z-40" @click="isOpen = false"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  ChevronUpIcon,
  UserIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const userStore = useUserStore()
const isOpen = ref(false)

const { currentUser, userFullName, isAdmin } = userStore

const userInitials = computed(() => {
  if (!currentUser.value) return '?'
  const first = currentUser.value.firstName.charAt(0).toUpperCase()
  const last = currentUser.value.lastName.charAt(0).toUpperCase()
  return `${first}${last}`
})

const subscriptionBadgeClass = computed(() => {
  const plan = currentUser.value?.subscription || 'free'
  const classes = {
    free: 'bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300',
    starter: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
    professional: 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300',
    enterprise: 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300'
  }
  return classes[plan as keyof typeof classes] || classes.free
})

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
  isOpen.value = false
}
</script>