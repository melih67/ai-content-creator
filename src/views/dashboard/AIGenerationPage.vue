<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
        AI Content Generation
      </h1>
      <p class="text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
        Create engaging social media content powered by AI. Provide context and let our AI generate personalized posts
        for your business.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Generation Form -->
      <div class="space-y-6">
        <!-- Company Selection -->
        <div
          class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-6">
          <h2 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
            Select Company
          </h2>

          <div v-if="userCompanies.length > 0" class="space-y-3">
            <div v-for="company in userCompanies" :key="company.id"
              class="flex items-center space-x-3 p-3 border border-secondary-200 dark:border-secondary-600 rounded-lg cursor-pointer transition-all duration-200"
              :class="{
                'border-primary-500 bg-primary-50 dark:bg-primary-900/20': form.companyId === company.id,
                'hover:border-secondary-300 dark:hover:border-secondary-500': form.companyId !== company.id
              }" @click="form.companyId = company.id">
              <input type="radio" :value="company.id" v-model="form.companyId"
                class="w-4 h-4 text-primary-600 border-secondary-300 focus:ring-primary-500" />
              <div
                class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span class="text-white font-semibold text-sm">
                  {{ company.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">
                  {{ company.name }}
                </p>
                <p class="text-xs text-secondary-500 dark:text-secondary-400 truncate">
                  {{ company.industry }}
                </p>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-6">
            <BuildingOfficeIcon class="w-12 h-12 text-secondary-400 mx-auto mb-3" />
            <p class="text-secondary-600 dark:text-secondary-400 mb-4">
              No companies found. Create a company first to generate content.
            </p>
            <router-link to="/dashboard/companies/new" class="btn-primary inline-flex items-center space-x-2">
              <PlusIcon class="w-4 h-4" />
              <span>Create Company</span>
            </router-link>
          </div>
        </div>

        <!-- Platform & Type Selection -->
        <div
          class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-6">
          <h2 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
            Platform & Content Type
          </h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Social Platform
              </label>
              <div class="grid grid-cols-2 gap-3">
                <button v-for="platform in socialPlatforms" :key="platform.value" type="button"
                  @click="form.platform = platform.value"
                  class="flex items-center justify-center space-x-2 p-3 border border-secondary-200 dark:border-secondary-600 rounded-lg transition-all duration-200"
                  :class="{
                    'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300': form.platform === platform.value,
                    'hover:border-secondary-300 dark:hover:border-secondary-500 text-secondary-700 dark:text-secondary-300': form.platform !== platform.value
                  }">
                  <component :is="platform.icon" class="w-4 h-4" />
                  <span class="text-sm font-medium">{{ platform.label }}</span>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Content Type
              </label>
              <select v-model="form.type" class="input-field">
                <option value="promotional">Promotional</option>
                <option value="educational">Educational</option>
                <option value="behind_the_scenes">Behind the Scenes</option>
                <option value="customer_story">Customer Story</option>
                <option value="announcement">Announcement</option>
                <option value="tips">Tips & Advice</option>
                <option value="inspiration">Inspirational</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Content Context -->
        <div
          class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-6">
          <h2 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
            Content Context
          </h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                What do you want to post about? *
              </label>
              <textarea v-model="form.prompt" rows="4" class="input-field"
                placeholder="e.g., We just completed a beautiful modern house construction project in downtown. The project features sustainable materials, smart home technology, and contemporary design..."
                required></textarea>
              <p class="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                Be specific about what you want to share. Include details like achievements, features, benefits, or any
                relevant context.
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Target Audience (Optional)
              </label>
              <input v-model="form.targetAudience" type="text" class="input-field"
                placeholder="e.g., Homeowners, Real estate investors, Architecture enthusiasts" />
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Tone & Style
              </label>
              <select v-model="form.tone" class="input-field">
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="casual">Casual</option>
                <option value="enthusiastic">Enthusiastic</option>
                <option value="informative">Informative</option>
                <option value="inspiring">Inspiring</option>
                <option value="humorous">Humorous</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Call to Action
              </label>
              <input v-model="form.callToAction" type="text" class="input-field"
                placeholder="e.g., Contact us for a free consultation, Visit our website, Book a tour" />
            </div>
          </div>
        </div>

        <!-- Generate Button -->
        <button @click="generateContent" :disabled="!canGenerate || isGenerating"
          class="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
          <div v-if="isGenerating" class="flex items-center justify-center space-x-2">
            <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Generating Content...</span>
          </div>
          <div v-else class="flex items-center justify-center space-x-2">
            <SparklesIcon class="w-5 h-5" />
            <span>Generate Content</span>
          </div>
        </button>
      </div>

      <!-- Generated Content Preview -->
      <div class="space-y-6">
        <!-- Preview Card -->
        <div
          class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
              Generated Content
            </h2>
            <div v-if="generatedContent" class="flex items-center space-x-2">
              <button @click="regenerateContent" :disabled="isGenerating"
                class="btn-outline text-sm py-2 px-3 disabled:opacity-50">
                <ArrowPathIcon class="w-4 h-4 mr-1" />
                Regenerate
              </button>
            </div>
          </div>

          <div v-if="generatedContent" class="space-y-4">
            <!-- Platform Preview -->
            <div class="flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400">
              <component :is="getPlatformIcon(form.platform)" class="w-4 h-4" />
              <span class="capitalize">{{ form.platform }}</span>
              <span>•</span>
              <span class="capitalize">{{ form.type.replace('_', ' ') }}</span>
            </div>

            <!-- Content -->
            <div class="bg-secondary-50 dark:bg-secondary-700 rounded-lg p-4">
              <p class="text-secondary-900 dark:text-secondary-100 whitespace-pre-wrap leading-relaxed">
                {{ generatedContent.content }}
              </p>
            </div>

            <!-- Hashtags -->
            <div v-if="generatedContent.hashtags && generatedContent.hashtags.length > 0" class="flex flex-wrap gap-2">
              <span v-for="hashtag in generatedContent.hashtags" :key="hashtag"
                class="inline-block text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full">
                #{{ hashtag }}
              </span>
            </div>

            <!-- Character Count -->
            <div class="flex items-center justify-between text-xs text-secondary-500 dark:text-secondary-400">
              <span>{{ generatedContent.content.length }} characters</span>
              <span class="flex items-center space-x-1">
                <ClockIcon class="w-3 h-3" />
                <span>Generated {{ formatTimeAgo(generatedContent.generatedAt) }}</span>
              </span>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-3 pt-4 border-t border-secondary-200 dark:border-secondary-600">
              <button @click="saveAsDraft" :disabled="isSaving" class="flex-1 btn-secondary disabled:opacity-50">
                {{ isSaving ? 'Saving...' : 'Save as Draft' }}
              </button>
              <button @click="editContent" class="flex-1 btn-outline">
                Edit Content
              </button>
            </div>
          </div>

          <div v-else class="text-center py-12">
            <div
              class="w-16 h-16 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <SparklesIcon class="w-8 h-8 text-secondary-400" />
            </div>
            <p class="text-secondary-600 dark:text-secondary-400">
              Generated content will appear here
            </p>
          </div>
        </div>

        <!-- Tips -->
        <div class="bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl p-6 text-white">
          <div class="flex items-start space-x-3">
            <LightBulbIcon class="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
            <div>
              <h3 class="font-semibold mb-2">💡 Tips for Better Content</h3>
              <ul class="text-sm text-accent-100 space-y-1">
                <li>• Be specific about your achievements or news</li>
                <li>• Include relevant details like features, benefits, or outcomes</li>
                <li>• Mention your target audience for more personalized content</li>
                <li>• Add context about your industry or business type</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCompanyStore } from '@/stores/company'
import { usePostsStore } from '@/stores/posts'
import type { SocialPlatform, PostType, AIGenerationResponse, AIGenerationRequest } from '@/types'
import {
  SparklesIcon,
  BuildingOfficeIcon,
  PlusIcon,
  ArrowPathIcon,
  ClockIcon,
  LightBulbIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const companyStore = useCompanyStore()
const postsStore = usePostsStore()

const { userCompanies } = companyStore

const isGenerating = ref(false)
const isSaving = ref(false)
const generatedContent = ref<AIGenerationResponse | null>(null)

const socialPlatforms = [
  { value: 'facebook', label: 'Facebook', icon: DocumentTextIcon },
  { value: 'instagram', label: 'Instagram', icon: DocumentTextIcon },
  { value: 'twitter', label: 'Twitter', icon: DocumentTextIcon },
  { value: 'linkedin', label: 'LinkedIn', icon: DocumentTextIcon },
  { value: 'tiktok', label: 'TikTok', icon: DocumentTextIcon }
]

const form = reactive({
  companyId: userCompanies.value && userCompanies.value.length > 0 ? userCompanies.value[0]?.id || '' : '',
  platform: 'facebook' as SocialPlatform,
  type: 'promotional' as PostType,
  prompt: '',
  targetAudience: '',
  tone: 'professional',
  callToAction: ''
})

const canGenerate = computed(() => {
  return form.companyId && form.platform && form.type && form.prompt.trim().length > 10
})

const getPlatformIcon = (platform: SocialPlatform) => {
  const platformData = socialPlatforms.find(p => p.value === platform)
  return platformData?.icon || DocumentTextIcon
}

const generateContent = async () => {
  if (!canGenerate.value) return

  isGenerating.value = true
  try {
    const company = companyStore.getCompanyById(form.companyId)
    if (!company) throw new Error('Company not found')

    const request: AIGenerationRequest = {
      companyId: form.companyId,
      platform: form.platform,
      postType: form.type,
      topic: form.prompt,
      tone: form.tone as any,
      length: 'medium',
      includeHashtags: true,
      includeEmojis: true,
      customInstructions: form.targetAudience ? `Target audience: ${form.targetAudience}. ${form.callToAction ? `Call to action: ${form.callToAction}` : ''}` : form.callToAction ? `Call to action: ${form.callToAction}` : undefined
    }

    generatedContent.value = await postsStore.generateContent(request)
  } catch (error) {
    console.error('Failed to generate content:', error)
  } finally {
    isGenerating.value = false
  }
}

const regenerateContent = () => {
  generateContent()
}

const saveAsDraft = async () => {
  if (!generatedContent.value) return

  isSaving.value = true
  try {
    const post = await postsStore.createPost({
      companyId: form.companyId,
      platform: form.platform,
      type: form.type,
      content: generatedContent.value.content,
      hashtags: generatedContent.value.hashtags,
      status: 'draft'
    })

    router.push(`/dashboard/posts/${post.id}/edit`)
  } catch (error) {
    console.error('Failed to save post:', error)
  } finally {
    isSaving.value = false
  }
}

const editContent = async () => {
  if (!generatedContent.value) return

  try {
    const post = await postsStore.createPost({
      companyId: form.companyId,
      platform: form.platform,
      type: form.type,
      content: generatedContent.value.content,
      hashtags: generatedContent.value.hashtags,
      status: 'draft'
    })

    router.push(`/dashboard/posts/${post.id}/edit`)
  } catch (error) {
    console.error('Failed to create post for editing:', error)
  }
}

const formatTimeAgo = (date: string) => {
  const now = new Date()
  const generated = new Date(date)
  const diffInMinutes = Math.floor((now.getTime() - generated.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d ago`
}
</script>