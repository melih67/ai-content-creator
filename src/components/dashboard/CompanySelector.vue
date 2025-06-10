<template>
  <div class="relative">
    <button @click="isOpen = !isOpen"
      class="w-full flex items-center justify-between p-3 rounded-lg bg-secondary-50 dark:bg-secondary-800 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-200">
      <div class="flex items-center space-x-3 min-w-0">
        <div
          class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
          <span class="text-white font-semibold text-sm">
            {{ currentCompany ? currentCompany.name.charAt(0).toUpperCase() : '?' }}
          </span>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">
            {{ currentCompany ? currentCompany.name : 'Select Company' }}
          </p>
          <p class="text-xs text-secondary-500 dark:text-secondary-400 truncate">
            {{ currentCompany ? currentCompany.industry : 'No company selected' }}
          </p>
        </div>
      </div>
      <ChevronDownIcon class="w-4 h-4 text-secondary-500 dark:text-secondary-400 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }" />
    </button>

    <!-- Dropdown -->
    <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="isOpen"
        class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto custom-scrollbar">
        <!-- Company List -->
        <div v-if="userCompanies.length > 0" class="p-2">
          <button v-for="company in userCompanies" :key="company.id" @click="selectCompany(company)"
            class="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors duration-200"
            :class="{
              'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300': currentCompany?.id === company.id
            }">
            <div
              class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
              <span class="text-white font-semibold text-sm">
                {{ company.name.charAt(0).toUpperCase() }}
              </span>
            </div>
            <div class="min-w-0 flex-1 text-left">
              <p class="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">
                {{ company.name }}
              </p>
              <p class="text-xs text-secondary-500 dark:text-secondary-400 truncate">
                {{ company.industry }}
              </p>
            </div>
            <CheckIcon v-if="currentCompany?.id === company.id"
              class="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </button>
        </div>

        <!-- No Companies State -->
        <div v-else class="p-4 text-center">
          <BuildingOfficeIcon class="w-8 h-8 text-secondary-400 mx-auto mb-2" />
          <p class="text-sm text-secondary-600 dark:text-secondary-400 mb-3">
            No companies yet
          </p>
        </div>

        <!-- Actions -->
        <div class="border-t border-secondary-200 dark:border-secondary-700 p-2">
          <router-link to="/dashboard/companies/new" @click="isOpen = false"
            class="w-full flex items-center space-x-2 p-2 rounded-md text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200">
            <PlusIcon class="w-4 h-4" />
            <span>Add New Company</span>
          </router-link>

          <router-link v-if="userCompanies.length > 0" to="/dashboard/companies" @click="isOpen = false"
            class="w-full flex items-center space-x-2 p-2 rounded-md text-sm font-medium text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors duration-200">
            <Cog6ToothIcon class="w-4 h-4" />
            <span>Manage Companies</span>
          </router-link>
        </div>
      </div>
    </Transition>

    <!-- Click outside to close -->
    <div v-if="isOpen" class="fixed inset-0 z-40" @click="isOpen = false"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCompanyStore } from '@/stores/company'
import type { Company } from '@/types'
import {
  ChevronDownIcon,
  CheckIcon,
  PlusIcon,
  Cog6ToothIcon,
  BuildingOfficeIcon
} from '@heroicons/vue/24/outline'

const companyStore = useCompanyStore()
const isOpen = ref(false)

const { userCompanies, currentCompany } = companyStore

const selectCompany = (company: Company) => {
  companyStore.setCurrentCompany(company)
  isOpen.value = false
}
</script>