import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabaseSubscriptionService, type SubscriptionPlan, type SubscriptionFeatures } from '@/services/supabase-subscription'
import { useUserStore } from './user'

export const useSubscriptionStore = defineStore('subscription', () => {
  const currentPlan = ref<SubscriptionPlan | null>(null)
  const usageStats = ref<any>(null)
  const isLoading = ref(false)
  const availablePlans = ref<SubscriptionPlan[]>([])

  const userStore = useUserStore()

  // Computed properties
  const features = computed((): SubscriptionFeatures | null => {
    return currentPlan.value?.features || null
  })

  const canCreateCompany = computed((): boolean => {
    if (!currentPlan.value || !usageStats.value) return false
    return supabaseSubscriptionService.canUserPerformAction(
      currentPlan.value.tier,
      'create_company',
      usageStats.value
    )
  })

  const canCreatePost = computed((): boolean => {
    if (!currentPlan.value || !usageStats.value) return false
    return supabaseSubscriptionService.canUserPerformAction(
      currentPlan.value.tier,
      'create_post',
      usageStats.value
    )
  })

  const canGenerateAI = computed((): boolean => {
    if (!currentPlan.value || !usageStats.value) return false
    return supabaseSubscriptionService.canUserPerformAction(
      currentPlan.value.tier,
      'generate_ai_content',
      usageStats.value
    )
  })

  const canUploadFile = computed((): boolean => {
    if (!currentPlan.value || !usageStats.value) return false
    return supabaseSubscriptionService.canUserPerformAction(
      currentPlan.value.tier,
      'upload_file',
      usageStats.value
    )
  })

  const hasAdvancedAnalytics = computed((): boolean => {
    return currentPlan.value?.features.hasAdvancedAnalytics || false
  })

  const hasCustomBranding = computed((): boolean => {
    return currentPlan.value?.features.hasCustomBranding || false
  })

  const hasTeamCollaboration = computed((): boolean => {
    return currentPlan.value?.features.hasTeamCollaboration || false
  })

  const hasAPIAccess = computed((): boolean => {
    return currentPlan.value?.features.hasAPIAccess || false
  })

  // Initialize subscription data
  const initializeSubscription = async (): Promise<void> => {
    if (!userStore.currentUser) return

    isLoading.value = true

    try {
      // Load available plans
      availablePlans.value = supabaseSubscriptionService.getSubscriptionPlans()

      // Load user's current subscription
      const subscriptionResponse = await supabaseSubscriptionService.getUserSubscription(userStore.currentUser.id)
      if (subscriptionResponse.success && subscriptionResponse.subscription) {
        currentPlan.value = subscriptionResponse.subscription
      }

      // Load usage statistics
      await refreshUsageStats()
    } catch (error) {
      console.error('Error initializing subscription:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Refresh usage statistics
  const refreshUsageStats = async (): Promise<void> => {
    if (!userStore.currentUser) return

    try {
      const response = await supabaseSubscriptionService.getUserUsageStats(userStore.currentUser.id)
      if (response.success && response.usage) {
        usageStats.value = response.usage
      }
    } catch (error) {
      console.error('Error refreshing usage stats:', error)
    }
  }

  // Upgrade subscription
  const upgradeSubscription = async (newTier: 'free' | 'starter' | 'professional' | 'enterprise'): Promise<boolean> => {
    if (!userStore.currentUser) return false

    isLoading.value = true

    try {
      const response = await supabaseSubscriptionService.updateUserSubscription(userStore.currentUser.id, newTier)
      
      if (response.success) {
        // Update current plan
        currentPlan.value = supabaseSubscriptionService.getSubscriptionPlan(newTier)
        
        // Update user in user store
        if (response.user) {
          userStore.currentUser = response.user
        }

        // Refresh usage stats
        await refreshUsageStats()

        return true
      }

      return false
    } catch (error) {
      console.error('Error upgrading subscription:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Get plan by tier
  const getPlanByTier = (tier: 'free' | 'starter' | 'professional' | 'enterprise'): SubscriptionPlan => {
    return supabaseSubscriptionService.getSubscriptionPlan(tier)
  }

  // Check if user can perform action
  const canPerformAction = (action: string): boolean => {
    if (!currentPlan.value || !usageStats.value) return false
    return supabaseSubscriptionService.canUserPerformAction(
      currentPlan.value.tier,
      action,
      usageStats.value
    )
  }

  // Get usage percentage for a specific limit
  const getUsagePercentage = (type: 'companies' | 'posts' | 'aiGenerations' | 'storage'): number => {
    if (!currentPlan.value || !usageStats.value) return 0

    const features = currentPlan.value.features
    const usage = usageStats.value

    switch (type) {
      case 'companies':
        if (features.maxCompanies === -1) return 0 // Unlimited
        return Math.min((usage.companiesCount / features.maxCompanies) * 100, 100)
      
      case 'posts':
        if (features.maxPostsPerMonth === -1) return 0 // Unlimited
        return Math.min((usage.postsThisMonth / features.maxPostsPerMonth) * 100, 100)
      
      case 'aiGenerations':
        if (features.aiGenerationsPerMonth === -1) return 0 // Unlimited
        return Math.min((usage.aiGenerationsThisMonth / features.aiGenerationsPerMonth) * 100, 100)
      
      case 'storage':
        if (features.storageLimit === -1) return 0 // Unlimited
        const storageInMB = usage.storageUsed / (1024 * 1024)
        return Math.min((storageInMB / features.storageLimit) * 100, 100)
      
      default:
        return 0
    }
  }

  // Clear subscription data (for logout)
  const clearData = (): void => {
    currentPlan.value = null
    usageStats.value = null
    availablePlans.value = []
  }

  return {
    currentPlan,
    usageStats,
    isLoading,
    availablePlans,
    features,
    canCreateCompany,
    canCreatePost,
    canGenerateAI,
    canUploadFile,
    hasAdvancedAnalytics,
    hasCustomBranding,
    hasTeamCollaboration,
    hasAPIAccess,
    initializeSubscription,
    refreshUsageStats,
    upgradeSubscription,
    getPlanByTier,
    canPerformAction,
    getUsagePercentage,
    clearData
  }
})