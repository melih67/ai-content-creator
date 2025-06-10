<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">Content Templates</h1>
        <p class="text-secondary-600 dark:text-secondary-400 mt-1">
          Pre-built templates to speed up your content creation
        </p>
      </div>
      <button class="btn-primary flex items-center space-x-2">
        <PlusIcon class="w-5 h-5" />
        <span>Create Template</span>
      </button>
    </div>

    <!-- Filter Tabs -->
    <div class="border-b border-secondary-200 dark:border-secondary-700">
      <nav class="-mb-px flex space-x-8">
        <button v-for="category in categories" :key="category.id" @click="activeCategory = category.id" :class="[
          'py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
          activeCategory === category.id
            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
            : 'border-transparent text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300 hover:border-secondary-300 dark:hover:border-secondary-600'
        ]">
          {{ category.name }}
        </button>
      </nav>
    </div>

    <!-- Templates Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="template in filteredTemplates" :key="template.id"
        class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 hover:shadow-lg transition-all duration-200 cursor-pointer group"
        @click="useTemplate(template)">
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div :class="[
                'w-10 h-10 rounded-lg flex items-center justify-center',
                template.category === 'promotional' ? 'bg-primary-100 dark:bg-primary-900/30' :
                  template.category === 'educational' ? 'bg-accent-100 dark:bg-accent-900/30' :
                    template.category === 'engagement' ? 'bg-success-100 dark:bg-success-900/30' :
                      'bg-warning-100 dark:bg-warning-900/30'
              ]">
                <component :is="getCategoryIcon(template.category)" :class="[
                  'w-5 h-5',
                  template.category === 'promotional' ? 'text-primary-600 dark:text-primary-400' :
                    template.category === 'educational' ? 'text-accent-600 dark:text-accent-400' :
                      template.category === 'engagement' ? 'text-success-600 dark:text-success-400' :
                        'text-warning-600 dark:text-warning-400'
                ]" />
              </div>
              <div>
                <h3 class="font-semibold text-secondary-900 dark:text-secondary-100">{{ template.name }}</h3>
                <p class="text-sm text-secondary-500 dark:text-secondary-400 capitalize">{{ template.category }}</p>
              </div>
            </div>
            <button @click.stop="toggleFavorite(template.id)" :class="[
              'p-1 rounded-full transition-colors duration-200',
              template.isFavorite
                ? 'text-red-500 hover:text-red-600'
                : 'text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300'
            ]">
              <HeartIcon :class="['w-5 h-5', template.isFavorite ? 'fill-current' : '']" />
            </button>
          </div>

          <p class="text-sm text-secondary-600 dark:text-secondary-400 mb-4 line-clamp-3">
            {{ template.description }}
          </p>

          <div class="bg-secondary-50 dark:bg-secondary-700 rounded-lg p-3 mb-4">
            <p class="text-sm text-secondary-700 dark:text-secondary-300 italic">
              "{{ template.preview }}"
            </p>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span v-for="platform in template.platforms" :key="platform"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 dark:bg-secondary-600 text-secondary-700 dark:text-secondary-300">
                {{ platform }}
              </span>
            </div>
            <div class="flex items-center space-x-1 text-xs text-secondary-500 dark:text-secondary-400">
              <EyeIcon class="w-4 h-4" />
              <span>{{ template.usageCount }}</span>
            </div>
          </div>
        </div>

        <div
          class="px-6 py-3 bg-secondary-50 dark:bg-secondary-700 rounded-b-xl border-t border-secondary-200 dark:border-secondary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div class="flex items-center justify-between">
            <button @click.stop="previewTemplate(template)"
              class="text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200 font-medium">
              Preview
            </button>
            <button @click.stop="useTemplate(template)"
              class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
              Use Template
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredTemplates.length === 0" class="text-center py-12">
      <DocumentTextIcon class="w-16 h-16 text-secondary-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
        No templates found
      </h3>
      <p class="text-secondary-600 dark:text-secondary-400 mb-6">
        No templates match your current filter. Try selecting a different category.
      </p>
      <button class="btn-primary">
        Create Your First Template
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  PlusIcon,
  HeartIcon,
  EyeIcon,
  DocumentTextIcon,
  MegaphoneIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline'

interface Template {
  id: string
  name: string
  description: string
  preview: string
  category: 'promotional' | 'educational' | 'engagement' | 'announcement'
  platforms: string[]
  usageCount: number
  isFavorite: boolean
  content: string
  hashtags: string[]
}

const activeCategory = ref('all')

const categories = [
  { id: 'all', name: 'All Templates' },
  { id: 'promotional', name: 'Promotional' },
  { id: 'educational', name: 'Educational' },
  { id: 'engagement', name: 'Engagement' },
  { id: 'announcement', name: 'Announcements' }
]

const templates = ref<Template[]>([
  {
    id: '1',
    name: 'Product Launch',
    description: 'Perfect template for announcing new products or services to your audience.',
    preview: 'Exciting news! We\'re thrilled to introduce our latest [PRODUCT NAME]...',
    category: 'promotional',
    platforms: ['Facebook', 'Instagram', 'Twitter'],
    usageCount: 245,
    isFavorite: true,
    content: 'Exciting news! We\'re thrilled to introduce our latest [PRODUCT NAME]. [BRIEF DESCRIPTION] \n\nKey features:\n• [FEATURE 1]\n• [FEATURE 2]\n• [FEATURE 3]\n\nAvailable now at [LINK]. Don\'t miss out!',
    hashtags: ['#NewProduct', '#Launch', '#Innovation']
  },
  {
    id: '2',
    name: 'Educational Tip',
    description: 'Share valuable tips and insights with your audience to establish thought leadership.',
    preview: 'Pro tip: Did you know that [INTERESTING FACT]?',
    category: 'educational',
    platforms: ['LinkedIn', 'Twitter', 'Facebook'],
    usageCount: 189,
    isFavorite: false,
    content: 'Pro tip: Did you know that [INTERESTING FACT]?\n\nHere\'s why this matters:\n[EXPLANATION]\n\nTry this today:\n[ACTIONABLE ADVICE]\n\nWhat\'s your experience with this? Share in the comments!',
    hashtags: ['#ProTip', '#Learning', '#DidYouKnow']
  },
  {
    id: '3',
    name: 'Question Post',
    description: 'Boost engagement by asking your audience thought-provoking questions.',
    preview: 'We\'d love to hear from you! What\'s your biggest challenge when it comes to [TOPIC]?',
    category: 'engagement',
    platforms: ['Facebook', 'Instagram', 'LinkedIn'],
    usageCount: 156,
    isFavorite: true,
    content: 'We\'d love to hear from you! \n\nWhat\'s your biggest challenge when it comes to [TOPIC]?\n\nDrop your thoughts in the comments below. We read every single one and love connecting with our community! 💬',
    hashtags: ['#Community', '#Question', '#LetsTalk']
  },
  {
    id: '4',
    name: 'Behind the Scenes',
    description: 'Give your audience a peek behind the curtain to build authentic connections.',
    preview: 'Take a look behind the scenes at [COMPANY/PROCESS]...',
    category: 'engagement',
    platforms: ['Instagram', 'Facebook', 'TikTok'],
    usageCount: 134,
    isFavorite: false,
    content: 'Take a look behind the scenes at [COMPANY/PROCESS]! \n\n[DESCRIBE WHAT\'S HAPPENING]\n\nWe believe in transparency and love sharing our journey with you. What would you like to see more of?',
    hashtags: ['#BehindTheScenes', '#Transparency', '#TeamWork']
  },
  {
    id: '5',
    name: 'Event Announcement',
    description: 'Promote upcoming events, webinars, or important dates to your audience.',
    preview: 'Mark your calendars! We\'re excited to announce [EVENT NAME]...',
    category: 'announcement',
    platforms: ['Facebook', 'LinkedIn', 'Twitter'],
    usageCount: 98,
    isFavorite: false,
    content: 'Mark your calendars! 📅\n\nWe\'re excited to announce [EVENT NAME] on [DATE] at [TIME].\n\n[EVENT DESCRIPTION]\n\nWhat to expect:\n• [HIGHLIGHT 1]\n• [HIGHLIGHT 2]\n• [HIGHLIGHT 3]\n\nRegister now: [LINK]',
    hashtags: ['#Event', '#SaveTheDate', '#DontMiss']
  },
  {
    id: '6',
    name: 'Customer Testimonial',
    description: 'Showcase customer success stories and build social proof.',
    preview: 'Here\'s what [CUSTOMER NAME] had to say about their experience...',
    category: 'promotional',
    platforms: ['Facebook', 'Instagram', 'LinkedIn'],
    usageCount: 167,
    isFavorite: true,
    content: 'Here\'s what [CUSTOMER NAME] had to say about their experience with us:\n\n"[TESTIMONIAL QUOTE]"\n\nWe\'re so grateful for customers like [CUSTOMER NAME] who trust us with [SERVICE/PRODUCT]. \n\nReady to start your own success story? [CALL TO ACTION]',
    hashtags: ['#CustomerLove', '#Testimonial', '#Success']
  }
])

const filteredTemplates = computed(() => {
  if (activeCategory.value === 'all') {
    return templates.value
  }
  return templates.value.filter(template => template.category === activeCategory.value)
})

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'promotional':
      return MegaphoneIcon
    case 'educational':
      return AcademicCapIcon
    case 'engagement':
      return ChatBubbleLeftRightIcon
    case 'announcement':
      return SparklesIcon
    default:
      return DocumentTextIcon
  }
}

const toggleFavorite = (templateId: string) => {
  const template = templates.value.find(t => t.id === templateId)
  if (template) {
    template.isFavorite = !template.isFavorite
  }
}

const previewTemplate = (template: Template) => {
  // TODO: Open preview modal
  console.log('Preview template:', template)
}

const useTemplate = (template: Template) => {
  // TODO: Navigate to AI generation page with template pre-filled
  console.log('Use template:', template)
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
    line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>