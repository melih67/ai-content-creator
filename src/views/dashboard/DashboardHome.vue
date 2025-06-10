<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold mb-2">
            Welcome back, {{ userFullName }}! 👋
          </h1>
          <p class="text-primary-100 mb-4">
            {{ currentCompany ? `Managing ${currentCompany.name}` : 'Ready to create amazing content?' }}
          </p>
          <div class="flex items-center space-x-4">
            <router-link to="/dashboard/generate"
              class="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors duration-200 flex items-center space-x-2">
              <SparklesIcon class="w-4 h-4" />
              <span>Generate Content</span>
            </router-link>
            <router-link v-if="!currentCompany" to="/dashboard/companies/new"
              class="border border-primary-200 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-400 transition-colors duration-200 flex items-center space-x-2">
              <PlusIcon class="w-4 h-4" />
              <span>Add Company</span>
            </router-link>
          </div>
        </div>
        <div class="hidden md:block">
          <div class="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
            <SparklesIcon class="w-16 h-16 text-white/80" />
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-secondary-600 dark:text-secondary-400">Total Posts</p>
            <p class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">{{ totalPosts }}</p>
          </div>
          <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
            <DocumentTextIcon class="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <ArrowUpIcon class="w-4 h-4 text-success-500 mr-1" />
          <span class="text-success-600 dark:text-success-400 font-medium">+12%</span>
          <span class="text-secondary-500 dark:text-secondary-400 ml-1">from last month</span>
        </div>
      </div>

      <div class="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-secondary-600 dark:text-secondary-400">Published</p>
            <p class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">{{ publishedPosts?.length || 0 }}
            </p>
          </div>
          <div class="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-lg flex items-center justify-center">
            <CheckCircleIcon class="w-6 h-6 text-success-600 dark:text-success-400" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <ArrowUpIcon class="w-4 h-4 text-success-500 mr-1" />
          <span class="text-success-600 dark:text-success-400 font-medium">+8%</span>
          <span class="text-secondary-500 dark:text-secondary-400 ml-1">from last month</span>
        </div>
      </div>

      <div class="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-secondary-600 dark:text-secondary-400">Drafts</p>
            <p class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">{{ draftPosts?.length || 0 }}</p>
          </div>
          <div class="w-12 h-12 bg-warning-100 dark:bg-warning-900/30 rounded-lg flex items-center justify-center">
            <PencilIcon class="w-6 h-6 text-warning-600 dark:text-warning-400" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <ArrowDownIcon class="w-4 h-4 text-error-500 mr-1" />
          <span class="text-error-600 dark:text-error-400 font-medium">-3%</span>
          <span class="text-secondary-500 dark:text-secondary-400 ml-1">from last month</span>
        </div>
      </div>

      <div class="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-secondary-600 dark:text-secondary-400">Companies</p>
            <p class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">{{ totalCompanies }}</p>
          </div>
          <div class="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center">
            <BuildingOfficeIcon class="w-6 h-6 text-accent-600 dark:text-accent-400" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <ArrowUpIcon class="w-4 h-4 text-success-500 mr-1" />
          <span class="text-success-600 dark:text-success-400 font-medium">+2</span>
          <span class="text-secondary-500 dark:text-secondary-400 ml-1">new this month</span>
        </div>
      </div>
    </div>

    <!-- Recent Activity & Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Posts -->
      <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700">
        <div class="p-6 border-b border-secondary-200 dark:border-secondary-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100">Recent Posts</h3>
            <router-link to="/dashboard/posts"
              class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
              View all
            </router-link>
          </div>
        </div>
        <div class="p-6">
          <div v-if="recentPosts.length > 0" class="space-y-4">
            <div v-for="post in recentPosts.slice(0, 3)" :key="post.id"
              class="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors duration-200 cursor-pointer"
              @click="$router.push(`/dashboard/posts/${post.id}`)">
              <div
                class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
                <component :is="getPlatformIcon(post.platform)" class="w-5 h-5 text-white" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">
                  {{ truncatePostContent(post.content) }}
                </p>
                <div class="flex items-center space-x-2 mt-1">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="getStatusBadgeClass(post.status)">
                    {{ post.status }}
                  </span>
                  <span class="text-xs text-secondary-500 dark:text-secondary-400">
                    {{ formatDate(post.createdAt) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <DocumentTextIcon class="w-12 h-12 text-secondary-400 mx-auto mb-3" />
            <p class="text-secondary-600 dark:text-secondary-400 mb-4">No posts yet</p>
            <router-link to="/dashboard/generate"
              class="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
              <SparklesIcon class="w-4 h-4" />
              <span>Create your first post</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700">
        <div class="p-6 border-b border-secondary-200 dark:border-secondary-700">
          <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100">Quick Actions</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-2 gap-4">
            <router-link to="/dashboard/generate"
              class="group p-4 rounded-lg border-2 border-dashed border-secondary-300 dark:border-secondary-600 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all duration-200">
              <div class="text-center">
                <SparklesIcon
                  class="w-8 h-8 text-secondary-400 group-hover:text-primary-500 mx-auto mb-2 transition-colors duration-200" />
                <p
                  class="text-sm font-medium text-secondary-700 dark:text-secondary-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                  Generate Content
                </p>
              </div>
            </router-link>

            <router-link to="/dashboard/companies/new"
              class="group p-4 rounded-lg border-2 border-dashed border-secondary-300 dark:border-secondary-600 hover:border-accent-400 dark:hover:border-accent-500 hover:bg-accent-50 dark:hover:bg-accent-900/10 transition-all duration-200">
              <div class="text-center">
                <BuildingOfficeIcon
                  class="w-8 h-8 text-secondary-400 group-hover:text-accent-500 mx-auto mb-2 transition-colors duration-200" />
                <p
                  class="text-sm font-medium text-secondary-700 dark:text-secondary-300 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-200">
                  Add Company
                </p>
              </div>
            </router-link>

            <router-link to="/dashboard/templates"
              class="group p-4 rounded-lg border-2 border-dashed border-secondary-300 dark:border-secondary-600 hover:border-warning-400 dark:hover:border-warning-500 hover:bg-warning-50 dark:hover:bg-warning-900/10 transition-all duration-200">
              <div class="text-center">
                <DocumentDuplicateIcon
                  class="w-8 h-8 text-secondary-400 group-hover:text-warning-500 mx-auto mb-2 transition-colors duration-200" />
                <p
                  class="text-sm font-medium text-secondary-700 dark:text-secondary-300 group-hover:text-warning-600 dark:group-hover:text-warning-400 transition-colors duration-200">
                  Templates
                </p>
              </div>
            </router-link>

            <router-link to="/dashboard/analytics"
              class="group p-4 rounded-lg border-2 border-dashed border-secondary-300 dark:border-secondary-600 hover:border-success-400 dark:hover:border-success-500 hover:bg-success-50 dark:hover:bg-success-900/10 transition-all duration-200">
              <div class="text-center">
                <ChartBarIcon
                  class="w-8 h-8 text-secondary-400 group-hover:text-success-500 mx-auto mb-2 transition-colors duration-200" />
                <p
                  class="text-sm font-medium text-secondary-700 dark:text-secondary-300 group-hover:text-success-600 dark:group-hover:text-success-400 transition-colors duration-200">
                  Analytics
                </p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Tips Section -->
    <div class="bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl p-6 text-white">
      <div class="flex items-start space-x-4">
        <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <LightBulbIcon class="w-6 h-6 text-white" />
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold mb-2">💡 Pro Tip</h3>
          <p class="text-accent-100 mb-4">
            Add detailed company information and upload relevant images to get more personalized and engaging
            AI-generated content for your social media posts.
          </p>
          <router-link to="/dashboard/companies"
            class="inline-flex items-center space-x-2 bg-white text-accent-600 px-4 py-2 rounded-lg font-medium hover:bg-accent-50 transition-colors duration-200">
            <Cog6ToothIcon class="w-4 h-4" />
            <span>Manage Companies</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useCompanyStore } from '@/stores/company'
import { usePostsStore } from '@/stores/posts'
import type { SocialPlatform } from '@/types'
import {
  SparklesIcon,
  PlusIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  PencilIcon,
  BuildingOfficeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
  DocumentDuplicateIcon,
  LightBulbIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'

const userStore = useUserStore()
const companyStore = useCompanyStore()
const postsStore = usePostsStore()

const { userFullName } = userStore
const { currentCompany, userCompanies } = companyStore
const { userPosts, draftPosts, publishedPosts } = postsStore

const totalPosts = computed(() => userPosts.value?.length || 0)
const totalCompanies = computed(() => userCompanies.value?.length || 0)
const recentPosts = computed(() =>
  userPosts.value ? [...userPosts.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : []
)

const getPlatformIcon = (platform: SocialPlatform) => {
  const icons = {
    facebook: DocumentTextIcon,
    instagram: DocumentTextIcon,
    twitter: DocumentTextIcon,
    linkedin: DocumentTextIcon,
    tiktok: DocumentTextIcon
  }
  return icons[platform] || DocumentTextIcon
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    draft: 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300',
    published: 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300',
    scheduled: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
  }
  return classes[status as keyof typeof classes] || classes.draft
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

const truncatePostContent = (content: string | undefined, maxLength = 50) => {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  return `${content.substring(0, maxLength)}...`;
};
</script>