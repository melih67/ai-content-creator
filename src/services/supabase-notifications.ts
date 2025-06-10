import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Notification = Database['public']['Tables']['notifications']['Row']
type NotificationInsert = Database['public']['Tables']['notifications']['Insert']
type NotificationUpdate = Database['public']['Tables']['notifications']['Update']

class SupabaseNotificationsService {
  async getUserNotifications(userId: string, limit: number = 50): Promise<{
    success: boolean
    notifications?: Notification[]
    error?: string
  }> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching notifications:', error)
        return { success: false, error: error.message }
      }

      return { success: true, notifications: data }
    } catch (error) {
      console.error('Error in getUserNotifications:', error)
      return { success: false, error: 'Failed to fetch notifications' }
    }
  }

  async getUnreadNotifications(userId: string): Promise<{
    success: boolean
    notifications?: Notification[]
    count?: number
    error?: string
  }> {
    try {
      const { data, error, count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('is_read', false)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching unread notifications:', error)
        return { success: false, error: error.message }
      }

      return { success: true, notifications: data, count: count || 0 }
    } catch (error) {
      console.error('Error in getUnreadNotifications:', error)
      return { success: false, error: 'Failed to fetch unread notifications' }
    }
  }

  async createNotification(notification: Omit<NotificationInsert, 'id' | 'created_at'>): Promise<{
    success: boolean
    notification?: Notification
    error?: string
  }> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single()

      if (error) {
        console.error('Error creating notification:', error)
        return { success: false, error: error.message }
      }

      return { success: true, notification: data }
    } catch (error) {
      console.error('Error in createNotification:', error)
      return { success: false, error: 'Failed to create notification' }
    }
  }

  async markAsRead(notificationId: string): Promise<{
    success: boolean
    notification?: Notification
    error?: string
  }> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .select()
        .single()

      if (error) {
        console.error('Error marking notification as read:', error)
        return { success: false, error: error.message }
      }

      return { success: true, notification: data }
    } catch (error) {
      console.error('Error in markAsRead:', error)
      return { success: false, error: 'Failed to mark notification as read' }
    }
  }

  async markAllAsRead(userId: string): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)

      if (error) {
        console.error('Error marking all notifications as read:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error in markAllAsRead:', error)
      return { success: false, error: 'Failed to mark all notifications as read' }
    }
  }

  async deleteNotification(notificationId: string): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) {
        console.error('Error deleting notification:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error in deleteNotification:', error)
      return { success: false, error: 'Failed to delete notification' }
    }
  }

  async deleteAllRead(userId: string): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId)
        .eq('is_read', true)

      if (error) {
        console.error('Error deleting read notifications:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error in deleteAllRead:', error)
      return { success: false, error: 'Failed to delete read notifications' }
    }
  }

  // Helper methods for creating specific types of notifications
  async notifyPostPublished(userId: string, postTitle: string, platform: string): Promise<{
    success: boolean
    notification?: Notification
    error?: string
  }> {
    return this.createNotification({
      user_id: userId,
      type: 'success',
      title: 'Post Published',
      message: `Your post "${postTitle}" has been published on ${platform}.`,
      action_url: '/posts'
    })
  }

  async notifySubscriptionUpgrade(userId: string, newPlan: string): Promise<{
    success: boolean
    notification?: Notification
    error?: string
  }> {
    return this.createNotification({
      user_id: userId,
      type: 'success',
      title: 'Subscription Upgraded',
      message: `Your subscription has been upgraded to ${newPlan}. Enjoy your new features!`,
      action_url: '/settings/subscription'
    })
  }

  async notifyLimitReached(userId: string, limitType: string): Promise<{
    success: boolean
    notification?: Notification
    error?: string
  }> {
    return this.createNotification({
      user_id: userId,
      type: 'warning',
      title: 'Limit Reached',
      message: `You've reached your ${limitType} limit. Consider upgrading your plan for more features.`,
      action_url: '/settings/subscription'
    })
  }

  async notifyError(userId: string, errorMessage: string): Promise<{
    success: boolean
    notification?: Notification
    error?: string
  }> {
    return this.createNotification({
      user_id: userId,
      type: 'error',
      title: 'Error Occurred',
      message: errorMessage,
      action_url: '/support'
    })
  }

  async notifyWelcome(userId: string): Promise<{
    success: boolean
    notification?: Notification
    error?: string
  }> {
    return this.createNotification({
      user_id: userId,
      type: 'info',
      title: 'Welcome to Aiva!',
      message: 'Welcome to Aiva! Start by creating your first company profile and generating amazing social media content.',
      action_url: '/companies/new'
    })
  }

  // Real-time subscription for notifications
  subscribeToUserNotifications(userId: string, callback: (notification: Notification) => void) {
    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Notification)
        }
      )
      .subscribe()

    return subscription
  }

  unsubscribeFromNotifications(subscription: any) {
    supabase.removeChannel(subscription)
  }
}

export const supabaseNotificationsService = new SupabaseNotificationsService()