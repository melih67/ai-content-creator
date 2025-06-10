import { supabase } from '@/lib/supabase'
import type { User, LoginRequest, RegisterRequest } from '@/types'
import type { Database } from '@/types/database'

type SupabaseUser = Database['public']['Tables']['users']['Row']
type SupabaseUserInsert = Database['public']['Tables']['users']['Insert']
type SupabaseUserUpdate = Database['public']['Tables']['users']['Update']

class SupabaseAuthService {
  async register(userData: RegisterRequest): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Register with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
          }
        }
      })

      if (authError) {
        return { success: false, error: authError.message }
      }

      if (!authData.user) {
        return { success: false, error: 'Registration failed' }
      }

      // Try to fetch the user profile created by trigger, with retry logic
      let profileData = null
      let attempts = 0
      const maxAttempts = 3
      
      while (attempts < maxAttempts && !profileData) {
        await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
        
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single()
        
        if (data) {
          profileData = data
          break
        }
        
        attempts++
        console.log(`Profile fetch attempt ${attempts} failed:`, error)
      }
      
      // If trigger didn't work, create profile manually
      if (!profileData) {
        console.log('Trigger failed, creating profile manually')
        const userProfile: SupabaseUserInsert = {
          id: authData.user.id,
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          subscription: 'free'
        }

        const { data: insertedData, error: insertError } = await supabase
          .from('users')
          .insert(userProfile)
          .select()
          .single()

        if (insertError) {
          console.error('Manual profile creation error:', insertError)
          return { success: false, error: `Failed to create user profile: ${insertError.message}` }
        }
        
        profileData = insertedData
      }

      const user: User = {
        id: profileData.id,
        email: profileData.email,
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        avatar: profileData.avatar || undefined,
        subscription: profileData.subscription,
        role: 'user', // Default role
        isActive: true, // Default active status
        createdAt: profileData.created_at,
        lastLoginAt: undefined // Not tracked in current schema
      }

      return { success: true, user }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'Registration failed' }
    }
  }

  async login(credentials: LoginRequest): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (authError) {
        return { success: false, error: authError.message }
      }

      if (!authData.user) {
        return { success: false, error: 'Login failed' }
      }

      // Update last login time
      await supabase
        .from('users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', authData.user.id)

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (profileError || !profileData) {
        return { success: false, error: 'Failed to fetch user profile' }
      }

      const user: User = {
        id: profileData.id,
        email: profileData.email,
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        avatar: profileData.avatar || undefined,
        subscription: profileData.subscription,
        role: 'user', // Default role
        isActive: true, // Default active status
        createdAt: profileData.created_at,
        lastLoginAt: undefined // Not tracked in current schema
      }

      return { success: true, user }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed' }
    }
  }

  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        return { success: false, error: error.message }
      }
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: 'Logout failed' }
    }
  }

  async getCurrentUser(): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

      if (authError || !authUser) {
        return { success: false, error: 'No authenticated user' }
      }

      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profileError || !profileData) {
        return { success: false, error: 'Failed to fetch user profile' }
      }

      const user: User = {
        id: profileData.id,
        email: profileData.email,
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        avatar: profileData.avatar || undefined,
        subscription: profileData.subscription,
        role: 'user', // Default role
        isActive: true, // Default active status
        createdAt: profileData.created_at,
        lastLoginAt: undefined // Not tracked in current schema
      }

      return { success: true, user }
    } catch (error) {
      console.error('Get current user error:', error)
      return { success: false, error: 'Failed to get current user' }
    }
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const profileUpdates: SupabaseUserUpdate = {
        first_name: updates.firstName,
        last_name: updates.lastName,
        avatar: updates.avatar,
        updated_at: new Date().toISOString()
      }

      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .update(profileUpdates)
        .eq('id', userId)
        .select()
        .single()

      if (profileError) {
        return { success: false, error: 'Failed to update profile' }
      }

      const user: User = {
        id: profileData.id,
        email: profileData.email,
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        avatar: profileData.avatar || undefined,
        subscription: profileData.subscription,
        role: 'user', // Default role
        isActive: true, // Default active status
        createdAt: profileData.created_at,
        lastLoginAt: undefined // Not tracked in current schema
      }

      return { success: true, user }
    } catch (error) {
      console.error('Update profile error:', error)
      return { success: false, error: 'Failed to update profile' }
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      return !!user
    } catch {
      return false
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileData) {
          const user: User = {
            id: profileData.id,
            email: profileData.email,
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            avatar: profileData.avatar || undefined,
            subscription: profileData.subscription,
            role: profileData.role,
            isActive: profileData.is_active,
            createdAt: profileData.created_at,
            lastLoginAt: profileData.last_login_at || undefined
          }
          callback(user)
        }
      } else {
        callback(null)
      }
    })
  }
}

export const supabaseAuthService = new SupabaseAuthService()