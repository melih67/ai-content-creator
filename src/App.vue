<template>
  <div id="app" :class="{ 'dark': isDark }" class="min-h-screen transition-colors duration-300">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const { isDark } = themeStore

// Initialize theme on app mount
onMounted(() => {
  themeStore.initializeTheme()
})
</script>

<style>
/* Global styles are handled in style.css */
</style>