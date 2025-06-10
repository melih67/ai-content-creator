<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">Posts</h1>
        <p class="text-secondary-600 dark:text-secondary-400 mt-1">
          Manage your social media posts and content
        </p>
      </div>
      <div class="flex items-center space-x-3">
        <router-link
          to="/dashboard/generate"
          class="btn-primary flex items-center space-x-2"
        >
          <SparklesIcon class="w-4 h-4" />
          <span>Generate Content</span>
        </router-link>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-4">
      <div class="flex flex-wrap items-center gap-4">
        <!-- Status Filter -->
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-secondary-700 dark:text-secondary-300">
            Status:
          </label>
          <select v-model="filters.status" class="input-field !py-2 min-w-0">
            <option value="">All</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        <!-- Platform Filter -->
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-secondary-700 dark:text-secondary-300">
            Platform:
          </label>
          <select v-model="filters.platform" class="input-field !py-2 min-w-0">
            <option value="">All</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
            <option value="tiktok">TikTok</option>
          </select>
        </div>

        <!-- Company Filter -->
        <div v-if="userCompanies.length > 1" class="flex items-center space-x-2">
          <label class="text-sm font-medium text-secondary-700 dark:text-secondary-300">
            Company:
          </label>
          <select v-model="filters.companyId" class="input-field !py-2 min-w-0">
            <option value="">All</option>
            <option v-for="company in userCompanies" :key="company.id" :value="company.id">
              {{ company.name }}
            </option>
          </select>
        </div>

        <!-- Search -->
        <div class="flex-1 min-w-64">
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search posts..."
              class="input-field !pl-10 !py-2"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Posts Grid -->
    <div v-if="filteredPosts.length > 0" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="post in filteredPosts"
        :key="post.id"
        class="group bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 hover:shadow-lg dark:hover:shadow-primary-500/10 cursor-pointer"
        @click="$router.push(`/dashboard/posts/${post.id}`)"
      >
        <div class="p-6">
          <!-- Post Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <component :is="getPlatformIcon(post.platform)" class="w-5 h-5 text-white" />
              </div>
              <div>
                <p class="text-sm font-medium text-secondary-900 dark:text-secondary-100 capitalize">
                  {{ post.platform }}
                </p>
                <p class="text-xs text-secondary-500 dark:text-secondary-400">
                  {{ getCompanyName(post.companyId) }}
                </p>
              </div>
            </div>
            
            <span 
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              :class="getStatusBadgeClass(post.status)"
            >
              {{ post.status }}
            </span>
          </div>

          <!-- Post Content -->
          <div class="mb-4">
            <p class="text-sm text-secondary-700 dark:text-secondary-300 line-clamp-4 mb-3">
              {{ post.content }}
            </p>
            
            <!-- Hashtags -->
            <div v-if="post.hashtags && post.hashtags.length > 0" class="flex flex-wrap gap-1 mb-3">
              <span
                v-for="hashtag in post.hashtags.slice(0, 3)"
                :key="hashtag"
                class="inline-block text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full"
              >
                #{{ hashtag }}
              </span>
              <span
                v-if="post.hashtags.length > 3"
                class="inline-block text-xs text-secondary-500 dark:text-secondary-400 px-2 py-1"
              >
                +{{ post.hashtags.length - 3 }} more
              </span>
            </div>
          </div>

          <!-- Post Meta -->
          <div class="flex items-center justify-between text-xs text-secondary-500 dark:text-secondary-400">
            <div class="flex items-center space-x-4">
              <span>{{ formatDate(post.createdAt) }}</span>
              <span v-if="post.scheduledFor" class="flex items-center space-x-1">
                <ClockIcon class="w-3 h-3" />
                <span>{{ formatDate(post.scheduledFor) }}</span>
              </span>
            </div>
            
            <!-- Post Actions -->
            <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                @click.stop="editPost(post)"
                class="p-1 text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              >
                <PencilIcon class="w-4 h-4" />
              </button>
              <button
                @click.stop="duplicatePost(post)"
                class="p-1 text-secondary-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors duration-200"
              >
                <DocumentDuplicateIcon class="w-4 h-4" />
              </button>
              <button
                @click.stop="confirmDelete(post)"
                class="p-1 text-secondary-400 hover:text-error-600 dark:hover:text-error-400 transition-colors duration-200"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="w-24 h-24 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mx-auto mb-6">
        <DocumentTextIcon class="w-12 h-12 text-secondary-400" />
      </div>
      <h3 class="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
        {{ filters.search || filters.status || filters.platform ? 'No posts found' : 'No posts yet' }}
      </h3>
      <p class="text-secondary-600 dark:text-secondary-400 mb-6 max-w-md mx-auto">
        {{ filters.search || filters.status || filters.platform 
          ? 'Try adjusting your filters to see more posts' 
          : 'Start creating amazing content with AI-powered generation' }}
      </p>
      <router-link
        v-if="!filters.search && !filters.status && !filters.platform"
        to="/dashboard/generate"
        class="btn-primary inline-flex items-center space-x-2"
      >
        <SparklesIcon class="w-4 h-4" />
        <span>Generate Your First Post</span>
      </router-link>
      <button
        v-else
        @click="clearFilters"
        class="btn-secondary inline-flex items-center space-x-2"
      >
        <XMarkIcon class="w-4 h-4" />
        <span>Clear Filters</span>
      </button>
    </div>

    <!-- Delete Confirmation Modal -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity bg-secondary-500 bg-opacity-75 dark:bg-secondary-900 dark:bg-opacity-75" @click="showDeleteModal = false"></div>

          <div class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-secondary-800 shadow-xl rounded-xl">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-10 h-10 bg-error-100 dark:bg-error-900/30 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon class="w-5 h-5 text-error-600 dark:text-error-400" />
              </div>
              <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                Delete Post
              </h3>
            </div>
            
            <p class="text-secondary-600 dark:text-secondary-400 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            
            <div class="flex items-center space-x-3">
              <button
                @click="showDeleteModal = false"
                class="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                @click="deletePost"
                :disabled="isDeleting"
                class="flex-1 bg-error-600 hover:bg-error-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                {{ isDeleting ? 'Deleting...' : 'Delete' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCompanyStore } from '@/stores/company'
import { usePostsStore } from '@/stores/posts'
import type { SocialPost, SocialPlatform } from '@/types'
import {
  SparklesIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  ClockIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const companyStore = useCompanyStore()
const postsStore = usePostsStore()

const { userCompanies } = companyStore
const { userPosts } = postsStore

const showDeleteModal = ref(false)
const postToDelete = ref<SocialPost | null>(null)
const isDeleting = ref(false)

const filters = reactive({
  status: '',
  platform: '',
  companyId: '',
  search: ''
})

const filteredPosts = computed(() => {
  let posts = Array.isArray(userPosts.value) ? [...userPosts.value] : []
  
  if (filters.status) {
    posts = posts.filter(post => post.status === filters.status)
  }
  
  if (filters.platform) {
    posts = posts.filter(post => post.platform === filters.platform)
  }
  
  if (filters.companyId) {
    posts = posts.filter(post => post.companyId === filters.companyId)
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    posts = posts.filter(post => 
      post.content.toLowerCase().includes(searchLower) ||
      post.hashtags?.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }
  
  return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

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

const getCompanyName = (companyId: string) => {
  const company = companyStore.getCompanyById(companyId)
  return company?.name || 'Unknown Company'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const editPost = (post: SocialPost) => {
  router.push(`/dashboard/posts/${post.id}/edit`)
}

const duplicatePost = async (post: SocialPost) => {
  try {
    await postsStore.createPost({
      companyId: post.companyId,
      platform: post.platform,
      type: post.type,
      content: post.content + ' (Copy)',
      hashtags: post.hashtags,
      status: 'draft'
    })
  } catch (error) {
    console.error('Failed to duplicate post:', error)
  }
}

const confirmDelete = (post: SocialPost) => {
  postToDelete.value = post
  showDeleteModal.value = true
}

const deletePost = async () => {
  if (!postToDelete.value) return
  
  isDeleting.value = true
  try {
    await postsStore.deletePost(postToDelete.value.id)
    showDeleteModal.value = false
    postToDelete.value = null
  } catch (error) {
    console.error('Failed to delete post:', error)
  } finally {
    isDeleting.value = false
  }
}

const clearFilters = () => {
  filters.status = ''
  filters.platform = ''
  filters.companyId = ''
  filters.search = ''
}
</script>

<style scoped>
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
    line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>