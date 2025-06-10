import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, RegisterData } from '@/types'
import { supabaseAuthService } from '@/services/supabase-auth'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)

  // Computed properties
  const userFullName = computed(() => {
    if (!currentUser.value) return ''
    return `${currentUser.value.firstName} ${currentUser.value.lastName}`
  })

  const isAdmin = computed(() => {
    return currentUser.value?.role === 'admin'
  })

  // Initialize user from localStorage
  const initializeUser = async () => {
    try {
      const result = await supabaseAuthService.getCurrentUser()
      if (result.success && result.user) {
        currentUser.value = result.user
        isAuthenticated.value = true
      } else {
        // Clear any invalid auth state
        logout()
      }
    } catch (error) {
      console.error('Failed to initialize user:', error)
      logout()
    }
  }

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    isLoading.value = true

    try {
      const credentials: LoginCredentials = { email, password }
      const response = await supabaseAuthService.login(credentials)

      if (response.success && response.user) {
        currentUser.value = response.user
        isAuthenticated.value = true
        return true
      }

      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Register function
  const register = async (userData: RegisterData): Promise<boolean> => {
    isLoading.value = true

    try {
      const response = await supabaseAuthService.register(userData)

      if (response.success && response.user) {
        currentUser.value = response.user
        isAuthenticated.value = true
        return true
      }

      return false
    } catch (error) {
      console.error('Registration error:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await supabaseAuthService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      currentUser.value = null
      isAuthenticated.value = false
    }
  }

  // Update profile
  const updateProfile = async (profileData: Partial<User>): Promise<boolean> => {
    if (!currentUser.value) return false

    isLoading.value = true

    try {
      const response = await supabaseAuthService.updateProfile(currentUser.value.id, profileData)

      if (response.success && response.user) {
        currentUser.value = response.user
        return true
      }

      return false
    } catch (error) {
      console.error('Profile update error:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Mock demo login
  const loginAsDemo = async () => {
    const demoUser: User = {
      id: 'demo-user',
      email: 'demo@aiva.com',
      firstName: 'Demo',
      lastName: 'User',
      role: 'user',
      subscription: 'professional',
      createdAt: new Date('2024-01-01'),
      lastLoginAt: new Date(),
      isActive: true
    }

    currentUser.value = demoUser
    isAuthenticated.value = true
    localStorage.setItem('currentUser', JSON.stringify(demoUser))

    // Create demo companies
    const demoCompanies: Company[] = [
      {
        id: 'demo-company-1',
        userId: 'demo-user',
        name: 'TechCorp Solutions',
        description: 'Leading technology solutions provider',
        industry: 'Technology',
        website: 'https://techcorp.com',
        socialMedia: {
          facebook: 'techcorp',
          instagram: 'techcorp_solutions',
          linkedin: 'techcorp-solutions'
        },
        brandColors: {
          primary: '#3B82F6',
          secondary: '#1E40AF'
        },
        brandVoice: 'professional',
        targetAudience: 'Business professionals and tech enthusiasts',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date()
      },
      {
        id: 'demo-company-2',
        userId: 'demo-user',
        name: 'Green Earth Construction',
        description: 'Sustainable construction and renovation services',
        industry: 'Construction',
        website: 'https://greenearthconstruction.com',
        socialMedia: {
          facebook: 'greenearthconstruction',
          instagram: 'green_earth_builds'
        },
        brandColors: {
          primary: '#059669',
          secondary: '#047857'
        },
        brandVoice: 'friendly',
        targetAudience: 'Homeowners and property developers',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date()
      }
    ]

    localStorage.setItem('companies', JSON.stringify(demoCompanies))

    return true
  }

  return {
    currentUser,
    isAuthenticated,
    isLoading,
    userFullName,
    isAdmin,
    initializeUser,
    login,
    register,
    logout,
    updateProfile,
    loginAsDemo
  }
})