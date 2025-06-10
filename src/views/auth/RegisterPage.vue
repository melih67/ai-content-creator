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

      <!-- Registration Form -->
      <div class="card-elevated p-8 animate-scale-in">
        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
            Create Your Account
          </h1>
          <p class="text-secondary-600 dark:text-secondary-400">
            Start your AI-powered social media journey
          </p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                First Name
              </label>
              <input id="firstName" v-model="form.firstName" type="text" required class="input" placeholder="John"
                :disabled="isLoading" />
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Last Name
              </label>
              <input id="lastName" v-model="form.lastName" type="text" required class="input" placeholder="Doe"
                :disabled="isLoading" />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Email Address
            </label>
            <input id="email" v-model="form.email" type="email" required class="input" placeholder="john@example.com"
              :disabled="isLoading" />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Password
            </label>
            <div class="relative">
              <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" required
                class="input pr-10" placeholder="Create a strong password" :disabled="isLoading"
                @input="validatePassword" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center" :disabled="isLoading">
                <EyeIcon v-if="showPassword" class="w-5 h-5 text-secondary-400" />
                <EyeSlashIcon v-else class="w-5 h-5 text-secondary-400" />
              </button>
            </div>

            <!-- Password Strength Indicator -->
            <div v-if="form.password" class="mt-2">
              <div class="flex space-x-1">
                <div v-for="i in 4" :key="i" class="h-1 flex-1 rounded-full transition-colors duration-200" :class="{
                  'bg-error-500': passwordStrength >= i && passwordStrength <= 1,
                  'bg-warning-500': passwordStrength >= i && passwordStrength === 2,
                  'bg-primary-500': passwordStrength >= i && passwordStrength === 3,
                  'bg-success-500': passwordStrength >= i && passwordStrength === 4,
                  'bg-secondary-200 dark:bg-secondary-700': passwordStrength < i
                }"></div>
              </div>
              <p class="text-xs mt-1 text-secondary-500 dark:text-secondary-400">
                {{ passwordStrengthText }}
              </p>
            </div>
          </div>

          <div>
            <label for="confirmPassword"
              class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Confirm Password
            </label>
            <input id="confirmPassword" v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
              required class="input pr-10" placeholder="Confirm your password" :disabled="isLoading" />
            <button type="button" @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center" :disabled="isLoading">
              <EyeIcon v-if="showConfirmPassword" class="w-5 h-5 text-secondary-400" />
              <EyeSlashIcon v-else class="w-5 h-5 text-secondary-400" />
            </button>
          </div>

          <div class="flex items-start">
            <input id="terms" v-model="form.acceptTerms" type="checkbox" required
              class="w-4 h-4 mt-1 text-primary-600 bg-secondary-100 border-secondary-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-secondary-800 focus:ring-2 dark:bg-secondary-700 dark:border-secondary-600"
              :disabled="isLoading" />
            <label for="terms" class="ml-2 text-sm text-secondary-600 dark:text-secondary-400">
              I agree to the
              <a href="#"
                class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">Terms
                of Service</a>
              and
              <a href="#"
                class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">Privacy
                Policy</a>
            </label>
          </div>

          <button type="submit" class="w-full btn-primary py-3 text-lg relative" :disabled="isLoading || !isFormValid">
            <span v-if="!isLoading">Create Account</span>
            <div v-else class="flex items-center justify-center">
              <div class="loading-dots">
                <div style="--i: 0"></div>
                <div style="--i: 1"></div>
                <div style="--i: 2"></div>
              </div>
              <span class="ml-2">Creating account...</span>
            </div>
          </button>
        </form>

        <!-- Error Message -->
        <div v-if="error"
          class="mt-4 p-3 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
          <p class="text-sm text-error-600 dark:text-error-400">{{ error }}</p>
        </div>

        <!-- Sign In Link -->
        <p class="mt-6 text-center text-sm text-secondary-600 dark:text-secondary-400">
          Already have an account?
          <router-link to="/login"
            class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
            Sign in here
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
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const userStore = useUserStore()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const error = ref('')
const passwordStrength = ref(0)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const passwordStrengthText = computed(() => {
  switch (passwordStrength.value) {
    case 1: return 'Weak password'
    case 2: return 'Fair password'
    case 3: return 'Good password'
    case 4: return 'Strong password'
    default: return 'Enter a password'
  }
})

const isFormValid = computed(() => {
  return (
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.password.length >= 8 &&
    form.password === form.confirmPassword &&
    form.acceptTerms
  )
})

const validatePassword = () => {
  const password = form.password
  let strength = 0

  if (password.length >= 8) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^\w\s]/.test(password)) strength++

  passwordStrength.value = strength
}

const handleRegister = async () => {
  if (isLoading.value || !isFormValid.value) return

  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  error.value = ''
  isLoading.value = true

  try {
    const success = await userStore.register({
      email: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName
    })

    if (success) {
      router.push('/dashboard')
    } else {
      error.value = 'Registration failed. Please try again.'
    }
  } catch (err) {
    error.value = 'An error occurred. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>