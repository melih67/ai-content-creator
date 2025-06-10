<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-50 via-white to-primary-50 dark:from-secondary-950 dark:via-secondary-900 dark:to-secondary-950 px-4">
    <!-- Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow">
      </div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-1000">
      </div>
    </div>

    <div class="relative w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-flex items-center space-x-2">
          <span class="text-3xl font-bold gradient-ai-text">Aiva</span>
        </router-link>
      </div>

      <!-- Login Form -->
      <div class="card-elevated p-8 animate-scale-in">
        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
            Welcome Back
          </h1>
          <p class="text-secondary-600 dark:text-secondary-400">
            Sign in to your account to continue
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Email Address
            </label>
            <input id="email" v-model="form.email" type="email" required class="input" placeholder="Enter your email"
              :disabled="isLoading" />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Password
            </label>
            <div class="relative">
              <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" required
                class="input pr-10" placeholder="Enter your password" :disabled="isLoading" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center" :disabled="isLoading">
                <EyeIcon v-if="showPassword" class="w-5 h-5 text-secondary-400" />
                <EyeSlashIcon v-else class="w-5 h-5 text-secondary-400" />
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input v-model="form.rememberMe" type="checkbox"
                class="w-4 h-4 text-primary-600 bg-secondary-100 border-secondary-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-secondary-800 focus:ring-2 dark:bg-secondary-700 dark:border-secondary-600"
                :disabled="isLoading" />
              <span class="ml-2 text-sm text-secondary-600 dark:text-secondary-400">Remember me</span>
            </label>
            <a href="#"
              class="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
              Forgot password?
            </a>
          </div>

          <button type="submit" class="w-full btn-primary py-3 text-lg relative" :disabled="isLoading">
            <span v-if="!isLoading">Sign In</span>
            <div v-else class="flex items-center justify-center">
              <div class="loading-dots">
                <div style="--i: 0"></div>
                <div style="--i: 1"></div>
                <div style="--i: 2"></div>
              </div>
              <span class="ml-2">Signing in...</span>
            </div>
          </button>
        </form>

        <!-- Demo Login -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-secondary-300 dark:border-secondary-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white dark:bg-secondary-900 text-secondary-500 dark:text-secondary-400">Or</span>
            </div>
          </div>

          <button @click="handleDemoLogin" class="w-full mt-4 btn-secondary py-3 text-lg" :disabled="isLoading">
            Try Demo Account
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="error"
          class="mt-4 p-3 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
          <p class="text-sm text-error-600 dark:text-error-400">{{ error }}</p>
        </div>

        <!-- Sign Up Link -->
        <p class="mt-6 text-center text-sm text-secondary-600 dark:text-secondary-400">
          Don't have an account?
          <router-link to="/register"
            class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
            Sign up for free
          </router-link>
        </p>
      </div>

      <!-- Theme Toggle -->
      <div class="flex justify-center mt-6">
        <ThemeToggle />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const handleLogin = async () => {
  if (isLoading.value) return

  error.value = ''
  isLoading.value = true

  try {
    const success = await userStore.login(form.email, form.password)

    if (success) {
      const redirectTo = route.query.redirect as string || '/dashboard'
      router.push(redirectTo)
    } else {
      error.value = 'Invalid email or password. Please try again.'
    }
  } catch (err) {
    error.value = 'An error occurred. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const handleDemoLogin = async () => {
  if (isLoading.value) return

  error.value = ''
  isLoading.value = true

  try {
    await userStore.loginAsDemo()
    router.push('/dashboard')
  } catch (err) {
    error.value = 'Failed to load demo. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>