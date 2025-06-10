<template>
  <router-link :to="to"
    class="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group"
    :class="{
      'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800': isActive,
      'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800 hover:text-secondary-900 dark:hover:text-secondary-100': !isActive
    }">
    <div class="flex items-center space-x-3">
      <component :is="icon" class="w-5 h-5 transition-colors duration-200" :class="{
        'text-primary-600 dark:text-primary-400': isActive,
        'text-secondary-500 dark:text-secondary-500 group-hover:text-secondary-700 dark:group-hover:text-secondary-300': !isActive
      }" />
      <span>{{ name }}</span>
    </div>

    <span v-if="badge" class="px-2 py-1 text-xs font-medium rounded-full transition-colors duration-200" :class="{
      'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300': isActive,
      'bg-secondary-200 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400': !isActive
    }">
      {{ badge }}
    </span>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Component } from 'vue'

interface Props {
  to: string
  icon: Component
  name: string
  badge?: string | number
}

const props = defineProps<Props>()
const route = useRoute()

const isActive = computed(() => {
  if (props.to === '/dashboard') {
    return route.path === '/dashboard'
  }
  return route.path.startsWith(props.to)
})
</script>