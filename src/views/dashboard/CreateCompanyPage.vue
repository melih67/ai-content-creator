<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center space-x-4">
      <button @click="$router.back()"
        class="p-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors duration-200">
        <ArrowLeftIcon class="w-5 h-5" />
      </button>
      <div>
        <h1 class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          {{ isEditing ? 'Edit Company' : 'Create New Company' }}
        </h1>
        <p class="text-secondary-600 dark:text-secondary-400 mt-1">
          {{ isEditing ? 'Update your company information' : 'Add your company details for personalized content generation' }}
        </p>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Information -->
      <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-6">
        <h2 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          Basic Information
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Company Name *
            </label>
            <input v-model="form.name" type="text" required class="input-field" placeholder="Enter company name" />
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Industry *
            </label>
            <select v-model="form.industry" required class="input-field">
              <option value="">Select industry</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Retail">Retail</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Construction">Construction</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Food & Beverage">Food & Beverage</option>
              <option value="Travel & Tourism">Travel & Tourism</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Automotive">Automotive</option>
              <option value="Fashion">Fashion</option>
              <option value="Sports & Fitness">Sports & Fitness</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div class="mt-6">
          <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Company Description *
          </label>
          <textarea v-model="form.description" required rows="4" class="input-field"
            placeholder="Describe your company, its mission, values, and what makes it unique..."></textarea>
          <p class="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
            This information helps AI generate more relevant and personalized content
          </p>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-6">
        <h2 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          Contact Information
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Website
            </label>
            <input v-model="form.website" type="url" class="input-field" placeholder="https://example.com" />
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Phone
            </label>
            <input v-model="form.phone" type="tel" class="input-field" placeholder="+1 (555) 123-4567" />
          </div>
        </div>

        <div class="mt-6">
          <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Address
          </label>
          <textarea v-model="form.address" rows="2" class="input-field" placeholder="Enter company address"></textarea>
        </div>
      </div>

      <!-- Marketing Information -->
      <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-6">
        <h2 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          Marketing Information
        </h2>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Target Audience
            </label>
            <input v-model="form.targetAudience" type="text" class="input-field"
              placeholder="e.g., Young professionals, Small business owners, Tech enthusiasts" />
            <p class="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
              Separate multiple audiences with commas
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Brand Voice & Tone
            </label>
            <select v-model="form.brandVoice" class="input-field">
              <option value="">Select brand voice</option>
              <option value="Professional">Professional</option>
              <option value="Friendly">Friendly</option>
              <option value="Casual">Casual</option>
              <option value="Authoritative">Authoritative</option>
              <option value="Playful">Playful</option>
              <option value="Inspirational">Inspirational</option>
              <option value="Educational">Educational</option>
              <option value="Humorous">Humorous</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Key Products/Services
            </label>
            <textarea v-model="form.products" rows="3" class="input-field"
              placeholder="List your main products or services..."></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Unique Selling Points
            </label>
            <textarea v-model="form.uniqueSellingPoints" rows="3" class="input-field"
              placeholder="What makes your company different from competitors?"></textarea>
          </div>
        </div>
      </div>

      <!-- Social Media Preferences -->
      <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-6">
        <h2 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          Social Media Preferences
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
              Preferred Platforms
            </label>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label v-for="platform in socialPlatforms" :key="platform.value"
                class="flex items-center space-x-3 p-3 border border-secondary-200 dark:border-secondary-600 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 cursor-pointer transition-colors duration-200"
                :class="{
                  'border-primary-500 bg-primary-50 dark:bg-primary-900/20': form.preferredPlatforms.includes(platform.value)
                }">
                <input v-model="form.preferredPlatforms" type="checkbox" :value="platform.value"
                  class="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500" />
                <span class="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  {{ platform.label }}
                </span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Content Themes
            </label>
            <input v-model="form.contentThemes" type="text" class="input-field"
              placeholder="e.g., Innovation, Sustainability, Customer Success, Behind the scenes" />
            <p class="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
              Separate themes with commas
            </p>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error"
        class="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg p-4">
        <div class="flex items-center space-x-2">
          <ExclamationCircleIcon class="w-5 h-5 text-error-600 dark:text-error-400" />
          <p class="text-error-700 dark:text-error-300 font-medium">{{ error }}</p>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex items-center justify-end space-x-4 pt-6">
        <button type="button" @click="$router.back()" class="btn-secondary">
          Cancel
        </button>
        <button type="submit" :disabled="isLoading" class="btn-primary">
          {{ isLoading ? 'Saving...' : (isEditing ? 'Update Company' : 'Create Company') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCompanyStore } from '@/stores/company'
import type { Company } from '@/types'
import {
  ArrowLeftIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const companyStore = useCompanyStore()

const isEditing = ref(false)
const isLoading = ref(false)
const error = ref('')

const socialPlatforms = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'tiktok', label: 'TikTok' }
]

const form = reactive({
  name: '',
  industry: '',
  description: '',
  website: '',
  phone: '',
  address: '',
  targetAudience: '',
  brandVoice: '',
  products: '',
  uniqueSellingPoints: '',
  preferredPlatforms: [] as string[],
  contentThemes: ''
})

const handleSubmit = async () => {
  error.value = ''
  isLoading.value = true

  try {
    const companyData: Omit<Company, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
      name: form.name,
      industry: form.industry,
      description: form.description,
      website: form.website || undefined,
      phone: form.phone || undefined,
      address: form.address || undefined,
      targetAudience: form.targetAudience || undefined,
      brandVoice: form.brandVoice || undefined,
      products: form.products || undefined,
      uniqueSellingPoints: form.uniqueSellingPoints || undefined,
      preferredPlatforms: form.preferredPlatforms && form.preferredPlatforms.length > 0 ? form.preferredPlatforms : undefined,
      contentThemes: form.contentThemes || undefined
    }

    if (isEditing.value) {
      await companyStore.updateCompany(route.params.id as string, companyData)
    } else {
      const newCompany = await companyStore.createCompany(companyData)
      // Set as current company if it's the first one
      if (newCompany && companyStore.userCompanies.value && companyStore.userCompanies.value.length === 1) {
        companyStore.setCurrentCompany(newCompany)
      }
    }

    router.push('/dashboard/companies')
  } catch (err) {
    error.value = 'Failed to save company. Please try again.'
    console.error('Error saving company:', err)
  } finally {
    isLoading.value = false
  }
}

const loadCompany = async () => {
  const companyId = route.params.id as string
  if (companyId && companyId !== 'new') {
    isEditing.value = true
    const company = companyStore.getCompanyById(companyId)
    if (company) {
      Object.assign(form, {
        name: company.name,
        industry: company.industry,
        description: company.description,
        website: company.website || '',
        phone: company.phone || '',
        address: company.address || '',
        targetAudience: company.targetAudience || '',
        brandVoice: company.brandVoice || '',
        products: company.products || '',
        uniqueSellingPoints: company.uniqueSellingPoints || '',
        preferredPlatforms: company.preferredPlatforms || [],
        contentThemes: company.contentThemes || ''
      })
    } else {
      router.push('/dashboard/companies')
    }
  }
}

onMounted(() => {
  loadCompany()
})
</script>