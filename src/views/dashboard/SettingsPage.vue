<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">Settings</h1>
      <p class="text-secondary-600 dark:text-secondary-400 mt-1">
        Manage your account preferences and application settings
      </p>
    </div>

    <!-- Settings Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Settings Navigation -->
      <div class="lg:col-span-1">
        <nav class="space-y-1">
          <button v-for="section in sections" :key="section.id" @click="activeSection = section.id" :class="[
            'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
            activeSection === section.id
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
              : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 hover:bg-secondary-100 dark:hover:bg-secondary-800'
          ]">
            <div class="flex items-center space-x-3">
              <component :is="section.icon" class="w-5 h-5" />
              <span>{{ section.name }}</span>
            </div>
          </button>
        </nav>
      </div>

      <!-- Settings Content -->
      <div class="lg:col-span-3">
        <!-- Profile Settings -->
        <div v-if="activeSection === 'profile'" class="space-y-6">
          <div
            class="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
            <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Profile Information
            </h3>
            <div class="space-y-6">
              <!-- Avatar Upload -->
              <div class="flex items-center space-x-6">
                <div class="relative">
                  <div class="w-24 h-24 rounded-full overflow-hidden bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center">
                    <img v-if="profileForm.avatar" :src="profileForm.avatar" alt="Avatar" class="w-full h-full object-cover" />
                    <UserIcon v-else class="w-12 h-12 text-secondary-400" />
                  </div>
                  <div v-if="isUploading" class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                </div>
                <div class="flex-1">
                  <h4 class="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-2">Profile Picture</h4>
                  <p class="text-sm text-secondary-600 dark:text-secondary-400 mb-4">Upload a new avatar or drag and drop</p>
                  
                  <!-- Drag and Drop Area -->
                   <div
                     @drop="onDrop"
                     @dragover="onDragOver"
                     @dragleave="onDragLeave"
                     :class="[
                       'relative border-2 border-dashed rounded-lg p-4 text-center transition-colors duration-200',
                       dragOver
                         ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                         : 'border-secondary-300 dark:border-secondary-600 hover:border-primary-400 dark:hover:border-primary-500'
                     ]"
                   >
                     <PhotoIcon class="w-8 h-8 text-secondary-400 mx-auto mb-2" />
                     <p class="text-sm text-secondary-600 dark:text-secondary-400 mb-2">
                       <span class="font-medium">Click to upload</span> or drag and drop
                     </p>
                     <p class="text-xs text-secondary-500 dark:text-secondary-500">PNG, JPG, GIF up to 5MB</p>
                     <input
                       type="file"
                       accept="image/*"
                       @change="onFileSelect"
                       class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                       :disabled="isUploading"
                     />
                   </div>
                </div>
              </div>
              
              <!-- Form Fields -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    First Name
                  </label>
                  <input
                    v-model="profileForm.firstName"
                    type="text"
                    class="input"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Last Name
                  </label>
                  <input
                    v-model="profileForm.lastName"
                    type="text"
                    class="input"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Email Address
                </label>
                <input
                  v-model="profileForm.email"
                  type="email"
                  class="input"
                  placeholder="Enter your email"
                  disabled
                />
                <p class="text-xs text-secondary-500 dark:text-secondary-500 mt-1">
                  Email cannot be changed. Contact support if you need to update your email.
                </p>
              </div>
              
              <!-- Save Button -->
              <div class="flex justify-end">
                <button
                  @click="saveProfile"
                  class="btn-primary"
                  :disabled="isUploading"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- General Settings -->
        <div v-if="activeSection === 'general'" class="space-y-6">
          <div
            class="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
            <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              General Preferences
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Language
                </label>
                <select class="input">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Timezone
                </label>
                <select class="input">
                  <option>UTC-8 (Pacific Time)</option>
                  <option>UTC-5 (Eastern Time)</option>
                  <option>UTC+0 (GMT)</option>
                  <option>UTC+1 (Central European Time)</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Date Format
                </label>
                <select class="input">
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>

          <div
            class="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
            <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Theme Preferences
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
                  Appearance
                </label>
                <div class="grid grid-cols-3 gap-3">
                  <label class="relative cursor-pointer">
                    <input type="radio" name="theme" value="light" class="sr-only" />
                    <div
                      class="p-3 border-2 border-secondary-200 dark:border-secondary-600 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors duration-200">
                      <div class="w-full h-8 bg-white rounded border border-secondary-200 mb-2"></div>
                      <p class="text-xs text-center text-secondary-600 dark:text-secondary-400">Light</p>
                    </div>
                  </label>
                  <label class="relative cursor-pointer">
                    <input type="radio" name="theme" value="dark" class="sr-only" />
                    <div
                      class="p-3 border-2 border-secondary-200 dark:border-secondary-600 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors duration-200">
                      <div class="w-full h-8 bg-secondary-800 rounded border border-secondary-600 mb-2"></div>
                      <p class="text-xs text-center text-secondary-600 dark:text-secondary-400">Dark</p>
                    </div>
                  </label>
                  <label class="relative cursor-pointer">
                    <input type="radio" name="theme" value="auto" class="sr-only" checked />
                    <div class="p-3 border-2 border-primary-500 rounded-lg">
                      <div
                        class="w-full h-8 bg-gradient-to-r from-white to-secondary-800 rounded border border-secondary-300 mb-2">
                      </div>
                      <p class="text-xs text-center text-primary-600 dark:text-primary-400 font-medium">Auto</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications Settings -->
        <div v-if="activeSection === 'notifications'" class="space-y-6">
          <div
            class="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
            <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Email Notifications
            </h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-secondary-900 dark:text-secondary-100">Post Published</p>
                  <p class="text-sm text-secondary-600 dark:text-secondary-400">Get notified when your scheduled posts
                    are published</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" checked />
                  <div
                    class="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-secondary-600 peer-checked:bg-primary-600">
                  </div>
                </label>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-secondary-900 dark:text-secondary-100">Analytics Reports</p>
                  <p class="text-sm text-secondary-600 dark:text-secondary-400">Weekly summary of your social media
                    performance</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" checked />
                  <div
                    class="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-secondary-600 peer-checked:bg-primary-600">
                  </div>
                </label>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-secondary-900 dark:text-secondary-100">New Features</p>
                  <p class="text-sm text-secondary-600 dark:text-secondary-400">Updates about new features and
                    improvements</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" />
                  <div
                    class="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-secondary-600 peer-checked:bg-primary-600">
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div
            class="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
            <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Push Notifications
            </h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-secondary-900 dark:text-secondary-100">Browser Notifications</p>
                  <p class="text-sm text-secondary-600 dark:text-secondary-400">Receive notifications in your browser
                  </p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" />
                  <div
                    class="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-secondary-600 peer-checked:bg-primary-600">
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Privacy Settings -->
        <div v-if="activeSection === 'privacy'" class="space-y-6">
          <div
            class="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
            <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Data & Privacy
            </h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-secondary-900 dark:text-secondary-100">Analytics Tracking</p>
                  <p class="text-sm text-secondary-600 dark:text-secondary-400">Help us improve by sharing anonymous
                    usage data</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" checked />
                  <div
                    class="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-secondary-600 peer-checked:bg-primary-600">
                  </div>
                </label>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-secondary-900 dark:text-secondary-100">Marketing Communications</p>
                  <p class="text-sm text-secondary-600 dark:text-secondary-400">Receive marketing emails and promotional
                    content</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" />
                  <div
                    class="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-secondary-600 peer-checked:bg-primary-600">
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div
            class="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
            <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Data Management
            </h3>
            <div class="space-y-4">
              <button
                class="w-full text-left p-4 border border-secondary-200 dark:border-secondary-600 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors duration-200">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-secondary-900 dark:text-secondary-100">Download Your Data</p>
                    <p class="text-sm text-secondary-600 dark:text-secondary-400">Get a copy of all your data</p>
                  </div>
                  <ArrowDownTrayIcon class="w-5 h-5 text-secondary-400" />
                </div>
              </button>
              <button
                class="w-full text-left p-4 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-red-600 dark:text-red-400">Delete Account</p>
                    <p class="text-sm text-red-500 dark:text-red-400">Permanently delete your account and all data</p>
                  </div>
                  <TrashIcon class="w-5 h-5 text-red-400" />
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Billing Settings -->
        <div v-if="activeSection === 'billing'" class="space-y-6">
          <div
            class="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
            <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Current Plan
            </h3>
            <div
              class="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
              <div>
                <p class="font-semibold text-primary-900 dark:text-primary-100">Pro Plan</p>
                <p class="text-sm text-primary-600 dark:text-primary-400">$29/month • Renews on March 15, 2024</p>
              </div>
              <button
                class="btn-outline text-primary-600 dark:text-primary-400 border-primary-300 dark:border-primary-600">
                Manage Plan
              </button>
            </div>
          </div>

          <div
            class="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
            <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Payment Method
            </h3>
            <div class="space-y-4">
              <div
                class="flex items-center justify-between p-4 border border-secondary-200 dark:border-secondary-600 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <span class="text-white text-xs font-bold">••••</span>
                  </div>
                  <div>
                    <p class="font-medium text-secondary-900 dark:text-secondary-100">•••• •••• •••• 4242</p>
                    <p class="text-sm text-secondary-600 dark:text-secondary-400">Expires 12/25</p>
                  </div>
                </div>
                <button
                  class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                  Update
                </button>
              </div>
            </div>
          </div>

          <div
            class="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
            <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Billing History
            </h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between py-2">
                <div>
                  <p class="font-medium text-secondary-900 dark:text-secondary-100">February 2024</p>
                  <p class="text-sm text-secondary-600 dark:text-secondary-400">Pro Plan</p>
                </div>
                <div class="text-right">
                  <p class="font-medium text-secondary-900 dark:text-secondary-100">$29.00</p>
                  <button
                    class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                    Download
                  </button>
                </div>
              </div>
              <div class="flex items-center justify-between py-2">
                <div>
                  <p class="font-medium text-secondary-900 dark:text-secondary-100">January 2024</p>
                  <p class="text-sm text-secondary-600 dark:text-secondary-400">Pro Plan</p>
                </div>
                <div class="text-right">
                  <p class="font-medium text-secondary-900 dark:text-secondary-100">$29.00</p>
                  <button
                    class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end">
      <button class="btn-primary">
        Save Changes
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  UserIcon,
  PhotoIcon
} from '@heroicons/vue/24/outline'
import { useUserStore } from '@/stores/user'
import { supabaseStorageService } from '@/services/supabase-storage'
import { computed } from 'vue'

const userStore = useUserStore()
const activeSection = ref('profile')
const isUploading = ref(false)
const dragOver = ref(false)

const currentUser = computed(() => userStore.currentUser)

const sections = [
  {
    id: 'profile',
    name: 'Profile',
    icon: UserIcon
  },
  {
    id: 'general',
    name: 'General',
    icon: CogIcon
  },
  {
    id: 'notifications',
    name: 'Notifications',
    icon: BellIcon
  },
  {
    id: 'privacy',
    name: 'Privacy',
    icon: ShieldCheckIcon
  },
  {
    id: 'billing',
    name: 'Billing',
    icon: CreditCardIcon
  }
]

// Profile form data
const profileForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  avatar: ''
})

// Initialize form with current user data
if (currentUser.value) {
  profileForm.value = {
    firstName: currentUser.value.firstName,
    lastName: currentUser.value.lastName,
    email: currentUser.value.email,
    avatar: currentUser.value.avatar || ''
  }
}

// Avatar upload functions
const handleAvatarUpload = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('Image must be smaller than 5MB')
    return
  }

  if (!currentUser.value) {
    alert('User not authenticated')
    return
  }

  isUploading.value = true

  try {
    const result = await supabaseStorageService.uploadUserAvatar(file, currentUser.value.id)
    
    if (result.success && result.fileUpload) {
      profileForm.value.avatar = result.fileUpload.url
      // Auto-save avatar
      await saveProfile()
    } else {
      alert(result.error || 'Failed to upload image')
    }
  } catch (error) {
    console.error('Avatar upload error:', error)
    alert('Failed to upload avatar')
  } finally {
    isUploading.value = false
  }
}

const onFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    handleAvatarUpload(file)
  }
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  dragOver.value = false
  
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    handleAvatarUpload(files[0])
  }
}

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  dragOver.value = true
}

const onDragLeave = () => {
  dragOver.value = false
}

const saveProfile = async () => {
  try {
    const success = await userStore.updateProfile({
      firstName: profileForm.value.firstName,
      lastName: profileForm.value.lastName,
      avatar: profileForm.value.avatar
    })
    
    if (success) {
      alert('Profile updated successfully!')
    } else {
      alert('Failed to update profile')
    }
  } catch (error) {
    console.error('Profile update error:', error)
    alert('Failed to update profile')
  }
}
</script>