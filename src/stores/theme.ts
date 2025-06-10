import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)
  const isInitialized = ref(false)

  const theme = computed(() => isDark.value ? 'dark' : 'light')

  const initializeTheme = () => {
    if (isInitialized.value) return

    // Check localStorage first
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      // Check system preference
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    // Apply theme to document
    updateDocumentTheme()
    isInitialized.value = true

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        isDark.value = e.matches
        updateDocumentTheme()
      }
    })
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', theme.value)
    updateDocumentTheme()
  }

  const setTheme = (newTheme: 'light' | 'dark') => {
    isDark.value = newTheme === 'dark'
    localStorage.setItem('theme', newTheme)
    updateDocumentTheme()
  }

  const updateDocumentTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return {
    isDark,
    theme,
    isInitialized,
    initializeTheme,
    toggleTheme,
    setTheme
  }
})