<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">Companies</h1>
        <p class="text-secondary-600 dark:text-secondary-400 mt-1">
          Manage your companies and their information for personalized content generation
        </p>
      </div>
      <router-link to="/dashboard/companies/new" class="btn-primary flex items-center space-x-2">
        <PlusIcon class="w-4 h-4" />
        <span>Add Company</span>
      </router-link>
    </div>

    <!-- Companies Grid -->
    <div v-if="userCompanies.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="company in userCompanies" :key="company.id"
        class="group bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 hover:shadow-lg dark:hover:shadow-primary-500/10">
        <div class="p-6">
          <!-- Company Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div
                class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
                <span class="text-white font-bold text-lg">
                  {{ company.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div class="min-w-0">
                <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 truncate">
                  {{ company.name }}
                </h3>
                <p class="text-sm text-secondary-500 dark:text-secondary-400 truncate">
                  {{ company.industry }}
                </p>
              </div>
            </div>

            <!-- Current Company Badge -->
            <div v-if="currentCompany?.id === company.id" class="flex-shrink-0">
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                <CheckCircleIcon class="w-3 h-3 mr-1" />
                Current
              </span>
            </div>
          </div>

          <!-- Company Description -->
          <p class="text-sm text-secondary-600 dark:text-secondary-400 mb-4 line-clamp-3">
            {{ company.description || 'No description provided' }}
          </p>

          <!-- Company Stats -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="text-center p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
              <p class="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                {{ getCompanyPostsCount(company.id) }}
              </p>
              <p class="text-xs text-secondary-500 dark:text-secondary-400">Posts</p>
            </div>
            <div class="text-center p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
              <p class="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                {{ company.targetAudience?.split(',').length || 0 }}
              </p>
              <p class="text-xs text-secondary-500 dark:text-secondary-400">Audiences</p>
            </div>
          </div>

          <!-- Company Actions -->
          <div class="flex items-center space-x-2">
            <button v-if="currentCompany?.id !== company.id" @click="selectCompany(company)"
              class="flex-1 btn-secondary text-sm py-2">
              Select
            </button>
            <router-link :to="`/dashboard/companies/${company.id}/edit`"
              class="flex-1 btn-outline text-sm py-2 text-center">
              Edit
            </router-link>
            <button @click="confirmDelete(company)"
              class="p-2 text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-colors duration-200">
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div
        class="w-24 h-24 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mx-auto mb-6">
        <BuildingOfficeIcon class="w-12 h-12 text-secondary-400" />
      </div>
      <h3 class="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
        No companies yet
      </h3>
      <p class="text-secondary-600 dark:text-secondary-400 mb-6 max-w-md mx-auto">
        Create your first company to start generating personalized content for your business
      </p>
      <router-link to="/dashboard/companies/new" class="btn-primary inline-flex items-center space-x-2">
        <PlusIcon class="w-4 h-4" />
        <span>Create Your First Company</span>
      </router-link>
    </div>

    <!-- Delete Confirmation Modal -->
    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div
            class="fixed inset-0 transition-opacity bg-secondary-500 bg-opacity-75 dark:bg-secondary-900 dark:bg-opacity-75"
            @click="showDeleteModal = false"></div>

          <div
            class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-secondary-800 shadow-xl rounded-xl">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-10 h-10 bg-error-100 dark:bg-error-900/30 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon class="w-5 h-5 text-error-600 dark:text-error-400" />
              </div>
              <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                Delete Company
              </h3>
            </div>

            <p class="text-secondary-600 dark:text-secondary-400 mb-6">
              Are you sure you want to delete <strong>{{ companyToDelete?.name }}</strong>? This action cannot be undone
              and will also delete all associated posts.
            </p>

            <div class="flex items-center space-x-3">
              <button @click="showDeleteModal = false" class="flex-1 btn-secondary">
                Cancel
              </button>
              <button @click="deleteCompany" :disabled="isDeleting"
                class="flex-1 bg-error-600 hover:bg-error-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
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
import { ref, computed } from 'vue'
import { useCompanyStore } from '@/stores/company'
import { usePostsStore } from '@/stores/posts'
import type { Company } from '@/types'
import {
  PlusIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const companyStore = useCompanyStore()
const postsStore = usePostsStore()

const { userCompanies, currentCompany } = companyStore
const { posts: allPosts } = postsStore // Renamed to avoid conflict if companyPosts was intended for something else

const showDeleteModal = ref(false)
const companyToDelete = ref<Company | null>(null)
const isDeleting = ref(false)

const getCompanyPostsCount = (companyId: string) => {
  if (!allPosts.value) return 0;
  return allPosts.value.filter(post => post.companyId === companyId).length;
}

const selectCompany = (company: Company) => {
  companyStore.setCurrentCompany(company)
}

const confirmDelete = (company: Company) => {
  companyToDelete.value = company
  showDeleteModal.value = true
}

const deleteCompany = async () => {
  if (!companyToDelete.value) return

  isDeleting.value = true
  try {
    await companyStore.deleteCompany(companyToDelete.value.id)
    showDeleteModal.value = false
    companyToDelete.value = null
  } catch (error) {
    console.error('Failed to delete company:', error)
  } finally {
    isDeleting.value = false
  }
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