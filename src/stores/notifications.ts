import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabaseNotificationsService } from '@/services/supabase-notifications'
import { useUserStore } from './user'
import type { Database } from '@/types/database'

type Notification = Database['public']['Tables']['notifications']['Row']

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])
  const isLoading = ref(false)
  const realtimeSubscription = ref<any>(null)

  const userStore = useUserStore()

  // Computed properties
  const unreadNotifications = computed(() => {
    return notifications.value.filter(n => !n.is_read)
  })

  const unreadCount = computed(() => {
    return unreadNotifications.value.length
  })

  const readNotifications = computed(() => {
    return notifications.value.filter(n => n.is_read)
  })

  const notificationsByType = computed(() => {
    return {
      info: notifications.value.filter(n => n.type === 'info'),
      success: notifications.value.filter(n => n.type === 'success'),
      warning: notifications.value.filter(n => n.type === 'warning'),
      error: notifications.value.filter(n => n.type === 'error')
    }
  })

  // Initialize notifications
  const initializeNotifications = async (): Promise<void> => {
    if (!userStore.currentUser) return

    isLoading.value = true

    try {
      await loadNotifications()
      setupRealtimeSubscription()
    } catch (error) {
      console.error('Error initializing notifications:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Load notifications from server
  const loadNotifications = async (limit: number = 50): Promise<void> => {
    if (!userStore.currentUser) return

    try {
      const response = await supabaseNotificationsService.getUserNotifications(userStore.currentUser.id, limit)
      
      if (response.success && response.notifications) {
        notifications.value = response.notifications
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

  // Load only unread notifications
  const loadUnreadNotifications = async (): Promise<void> => {
    if (!userStore.currentUser) return

    try {
      const response = await supabaseNotificationsService.getUnreadNotifications(userStore.currentUser.id)
      
      if (response.success && response.notifications) {
        // Update existing notifications or add new ones
        response.notifications.forEach(newNotification => {
          const existingIndex = notifications.value.findIndex(n => n.id === newNotification.id)
          if (existingIndex !== -1) {
            notifications.value[existingIndex] = newNotification
          } else {
            notifications.value.unshift(newNotification)
          }
        })
      }
    } catch (error) {
      console.error('Error loading unread notifications:', error)
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId: string): Promise<boolean> => {
    try {
      const response = await supabaseNotificationsService.markAsRead(notificationId)
      
      if (response.success && response.notification) {
        // Update local state
        const index = notifications.value.findIndex(n => n.id === notificationId)
        if (index !== -1) {
          notifications.value[index] = response.notification
        }
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error marking notification as read:', error)
      return false
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async (): Promise<boolean> => {
    if (!userStore.currentUser) return false

    try {
      const response = await supabaseNotificationsService.markAllAsRead(userStore.currentUser.id)
      
      if (response.success) {
        // Update local state
        notifications.value = notifications.value.map(n => ({ ...n, is_read: true }))
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      return false
    }
  }

  // Delete notification
  const deleteNotification = async (notificationId: string): Promise<boolean> => {
    try {
      const response = await supabaseNotificationsService.deleteNotification(notificationId)
      
      if (response.success) {
        // Remove from local state
        const index = notifications.value.findIndex(n => n.id === notificationId)
        if (index !== -1) {
          notifications.value.splice(index, 1)
        }
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error deleting notification:', error)
      return false
    }
  }

  // Delete all read notifications
  const deleteAllRead = async (): Promise<boolean> => {
    if (!userStore.currentUser) return false

    try {
      const response = await supabaseNotificationsService.deleteAllRead(userStore.currentUser.id)
      
      if (response.success) {
        // Remove read notifications from local state
        notifications.value = notifications.value.filter(n => !n.is_read)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error deleting read notifications:', error)
      return false
    }
  }

  // Add new notification (for real-time updates)
  const addNotification = (notification: Notification): void => {
    notifications.value.unshift(notification)
  }

  // Setup real-time subscription
  const setupRealtimeSubscription = (): void => {
    if (!userStore.currentUser || realtimeSubscription.value) return

    realtimeSubscription.value = supabaseNotificationsService.subscribeToUserNotifications(
      userStore.currentUser.id,
      (notification: Notification) => {
        addNotification(notification)
      }
    )
  }

  // Cleanup real-time subscription
  const cleanupRealtimeSubscription = (): void => {
    if (realtimeSubscription.value) {
      supabaseNotificationsService.unsubscribeFromNotifications(realtimeSubscription.value)
      realtimeSubscription.value = null
    }
  }

  // Helper methods for creating notifications
  const notifyPostPublished = async (postTitle: string, platform: string): Promise<void> => {
    if (!userStore.currentUser) return

    try {
      const response = await supabaseNotificationsService.notifyPostPublished(
        userStore.currentUser.id,
        postTitle,
        platform
      )
      
      if (response.success && response.notification) {
        addNotification(response.notification)
      }
    } catch (error) {
      console.error('Error creating post published notification:', error)
    }
  }

  const notifySubscriptionUpgrade = async (newPlan: string): Promise<void> => {
    if (!userStore.currentUser) return

    try {
      const response = await supabaseNotificationsService.notifySubscriptionUpgrade(
        userStore.currentUser.id,
        newPlan
      )
      
      if (response.success && response.notification) {
        addNotification(response.notification)
      }
    } catch (error) {
      console.error('Error creating subscription upgrade notification:', error)
    }
  }

  const notifyLimitReached = async (limitType: string): Promise<void> => {
    if (!userStore.currentUser) return

    try {
      const response = await supabaseNotificationsService.notifyLimitReached(
        userStore.currentUser.id,
        limitType
      )
      
      if (response.success && response.notification) {
        addNotification(response.notification)
      }
    } catch (error) {
      console.error('Error creating limit reached notification:', error)
    }
  }

  const notifyError = async (errorMessage: string): Promise<void> => {
    if (!userStore.currentUser) return

    try {
      const response = await supabaseNotificationsService.notifyError(
        userStore.currentUser.id,
        errorMessage
      )
      
      if (response.success && response.notification) {
        addNotification(response.notification)
      }
    } catch (error) {
      console.error('Error creating error notification:', error)
    }
  }

  const notifyWelcome = async (): Promise<void> => {
    if (!userStore.currentUser) return

    try {
      const response = await supabaseNotificationsService.notifyWelcome(userStore.currentUser.id)
      
      if (response.success && response.notification) {
        addNotification(response.notification)
      }
    } catch (error) {
      console.error('Error creating welcome notification:', error)
    }
  }

  // Clear all data (for logout)
  const clearData = (): void => {
    notifications.value = []
    cleanupRealtimeSubscription()
  }

  return {
    notifications,
    isLoading,
    unreadNotifications,
    unreadCount,
    readNotifications,
    notificationsByType,
    initializeNotifications,
    loadNotifications,
    loadUnreadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
    addNotification,
    setupRealtimeSubscription,
    cleanupRealtimeSubscription,
    notifyPostPublished,
    notifySubscriptionUpgrade,
    notifyLimitReached,
    notifyError,
    notifyWelcome,
    clearData
  }
})