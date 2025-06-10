import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type User = Database['public']['Tables']['users']['Row']
type SubscriptionTier = 'free' | 'starter' | 'professional' | 'enterprise'

export interface SubscriptionFeatures {
  maxCompanies: number
  maxPostsPerMonth: number
  aiGenerationsPerMonth: number
  hasAdvancedAnalytics: boolean
  hasCustomBranding: boolean
  hasTeamCollaboration: boolean
  hasAPIAccess: boolean
  storageLimit: number // in MB
  supportLevel: 'community' | 'email' | 'priority' | 'dedicated'
}

export interface SubscriptionPlan {
  tier: SubscriptionTier
  name: string
  price: number
  features: SubscriptionFeatures
  description: string
}

class SupabaseSubscriptionService {
  private subscriptionPlans: Record<SubscriptionTier, SubscriptionPlan> = {
    free: {
      tier: 'free',
      name: 'Free',
      price: 0,
      description: 'Perfect for getting started',
      features: {
        maxCompanies: 1,
        maxPostsPerMonth: 10,
        aiGenerationsPerMonth: 5,
        hasAdvancedAnalytics: false,
        hasCustomBranding: false,
        hasTeamCollaboration: false,
        hasAPIAccess: false,
        storageLimit: 100, // 100MB
        supportLevel: 'community'
      }
    },
    starter: {
      tier: 'starter',
      name: 'Starter',
      price: 19,
      description: 'Great for small businesses',
      features: {
        maxCompanies: 3,
        maxPostsPerMonth: 50,
        aiGenerationsPerMonth: 25,
        hasAdvancedAnalytics: true,
        hasCustomBranding: false,
        hasTeamCollaboration: false,
        hasAPIAccess: false,
        storageLimit: 500, // 500MB
        supportLevel: 'email'
      }
    },
    professional: {
      tier: 'professional',
      name: 'Professional',
      price: 49,
      description: 'For growing businesses',
      features: {
        maxCompanies: 10,
        maxPostsPerMonth: 200,
        aiGenerationsPerMonth: 100,
        hasAdvancedAnalytics: true,
        hasCustomBranding: true,
        hasTeamCollaboration: true,
        hasAPIAccess: true,
        storageLimit: 2000, // 2GB
        supportLevel: 'priority'
      }
    },
    enterprise: {
      tier: 'enterprise',
      name: 'Enterprise',
      price: 99,
      description: 'For large organizations',
      features: {
        maxCompanies: -1, // unlimited
        maxPostsPerMonth: -1, // unlimited
        aiGenerationsPerMonth: -1, // unlimited
        hasAdvancedAnalytics: true,
        hasCustomBranding: true,
        hasTeamCollaboration: true,
        hasAPIAccess: true,
        storageLimit: -1, // unlimited
        supportLevel: 'dedicated'
      }
    }
  }

  async getUserSubscription(userId: string) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('subscription')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user subscription:', error)
        return { success: false, error: error.message }
      }

      const subscription = this.subscriptionPlans[user.subscription as SubscriptionTier]
      return { success: true, subscription }
    } catch (error) {
      console.error('Error in getUserSubscription:', error)
      return { success: false, error: 'Failed to fetch subscription' }
    }
  }

  async updateUserSubscription(userId: string, newTier: SubscriptionTier) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ subscription: newTier })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        console.error('Error updating subscription:', error)
        return { success: false, error: error.message }
      }

      return { success: true, user: data }
    } catch (error) {
      console.error('Error in updateUserSubscription:', error)
      return { success: false, error: 'Failed to update subscription' }
    }
  }

  getSubscriptionPlans(): SubscriptionPlan[] {
    return Object.values(this.subscriptionPlans)
  }

  getSubscriptionPlan(tier: SubscriptionTier): SubscriptionPlan {
    return this.subscriptionPlans[tier]
  }

  canUserPerformAction(userSubscription: SubscriptionTier, action: string, currentUsage?: any): boolean {
    const plan = this.subscriptionPlans[userSubscription]
    
    switch (action) {
      case 'create_company':
        if (plan.features.maxCompanies === -1) return true
        return (currentUsage?.companiesCount || 0) < plan.features.maxCompanies
      
      case 'create_post':
        if (plan.features.maxPostsPerMonth === -1) return true
        return (currentUsage?.postsThisMonth || 0) < plan.features.maxPostsPerMonth
      
      case 'generate_ai_content':
        if (plan.features.aiGenerationsPerMonth === -1) return true
        return (currentUsage?.aiGenerationsThisMonth || 0) < plan.features.aiGenerationsPerMonth
      
      case 'upload_file':
        if (plan.features.storageLimit === -1) return true
        return (currentUsage?.storageUsed || 0) < plan.features.storageLimit * 1024 * 1024 // Convert MB to bytes
      
      case 'access_analytics':
        return plan.features.hasAdvancedAnalytics
      
      case 'custom_branding':
        return plan.features.hasCustomBranding
      
      case 'team_collaboration':
        return plan.features.hasTeamCollaboration
      
      case 'api_access':
        return plan.features.hasAPIAccess
      
      default:
        return true
    }
  }

  async getUserUsageStats(userId: string) {
    try {
      // Get current month's usage
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      // Count companies
      const { count: companiesCount } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      // Count posts this month
      const { count: postsThisMonth } = await supabase
        .from('social_posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString())

      // Count AI generations this month (assuming we track this in posts with ai_prompt)
      const { count: aiGenerationsThisMonth } = await supabase
        .from('social_posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .not('ai_prompt', 'is', null)
        .gte('created_at', startOfMonth.toISOString())

      // Calculate storage used (sum of file sizes)
      const { data: files } = await supabase
        .from('file_uploads')
        .select('size')

      const storageUsed = files?.reduce((total, file) => total + file.size, 0) || 0

      return {
        success: true,
        usage: {
          companiesCount: companiesCount || 0,
          postsThisMonth: postsThisMonth || 0,
          aiGenerationsThisMonth: aiGenerationsThisMonth || 0,
          storageUsed
        }
      }
    } catch (error) {
      console.error('Error fetching usage stats:', error)
      return { success: false, error: 'Failed to fetch usage statistics' }
    }
  }
}

export const supabaseSubscriptionService = new SupabaseSubscriptionService()