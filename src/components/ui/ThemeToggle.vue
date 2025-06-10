<template>
  <button @click="toggleTheme"
    class="p-2 rounded-lg bg-secondary-100 hover:bg-secondary-200 dark:bg-secondary-800 dark:hover:bg-secondary-700 transition-all duration-200 hover-lift"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
    <Transition name="theme-icon" mode="out-in">
      <SunIcon v-if="isDark" class="w-5 h-5 text-yellow-500" />
      <MoonIcon v-else class="w-5 h-5 text-secondary-600" />
    </Transition>
  </button>
</template>

<script setup lang="ts">
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const { isDark, toggleTheme } = themeStore
</script>

<style scoped>
.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: all 0.2s ease;
}

.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}

.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}
</style>