<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">Analytics</h1>
        <p class="text-secondary-600 dark:text-secondary-400 mt-1">
          Track your social media performance and engagement
        </p>
      </div>
    </div>

    <!-- Analytics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Reach -->
      <div class="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-secondary-600 dark:text-secondary-400">Total Reach</p>
            <p class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">12.5K</p>
          </div>
          <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
            <EyeIcon class="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <ArrowUpIcon class="w-4 h-4 text-success-500 mr-1" />
          <span class="text-success-600 dark:text-success-400 font-medium">+15%</span>
          <span class="text-secondary-500 dark:text-secondary-400 ml-1">from last month</span>
        </div>
      </div>

      <!-- Engagement Rate -->
      <div class="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-secondary-600 dark:text-secondary-400">Engagement Rate</p>
            <p class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">4.2%</p>
          </div>
          <div class="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center">
            <HeartIcon class="w-6 h-6 text-accent-600 dark:text-accent-400" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <ArrowUpIcon class="w-4 h-4 text-success-500 mr-1" />
          <span class="text-success-600 dark:text-success-400 font-medium">+8%</span>
          <span class="text-secondary-500 dark:text-secondary-400 ml-1">from last month</span>
        </div>
      </div>

      <!-- Total Followers -->
      <div class="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-secondary-600 dark:text-secondary-400">Total Followers</p>
            <p class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">8.9K</p>
          </div>
          <div class="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-lg flex items-center justify-center">
            <UsersIcon class="w-6 h-6 text-success-600 dark:text-success-400" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <ArrowUpIcon class="w-4 h-4 text-success-500 mr-1" />
          <span class="text-success-600 dark:text-success-400 font-medium">+12%</span>
          <span class="text-secondary-500 dark:text-secondary-400 ml-1">from last month</span>
        </div>
      </div>

      <!-- Click-through Rate -->
      <div class="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-secondary-600 dark:text-secondary-400">Click-through Rate</p>
            <p class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">2.8%</p>
          </div>
          <div class="w-12 h-12 bg-warning-100 dark:bg-warning-900/30 rounded-lg flex items-center justify-center">
            <CursorArrowRaysIcon class="w-6 h-6 text-warning-600 dark:text-warning-400" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <ArrowUpIcon class="w-4 h-4 text-success-500 mr-1" />
          <span class="text-success-600 dark:text-success-400 font-medium">+5%</span>
          <span class="text-secondary-500 dark:text-secondary-400 ml-1">from last month</span>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Engagement Chart -->
      <div class="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
        <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          Engagement Over Time
        </h3>
        <div class="h-64 flex items-center justify-center text-secondary-500 dark:text-secondary-400">
          <div class="text-center">
            <ChartBarIcon class="w-16 h-16 mx-auto mb-2 opacity-50" />
            <p>Chart visualization coming soon</p>
          </div>
        </div>
      </div>

      <!-- Platform Performance -->
      <div class="bg-white dark:bg-secondary-800 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700">
        <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          Platform Performance
        </h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-3 rounded-lg bg-secondary-50 dark:bg-secondary-700">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span class="text-white text-sm font-bold">f</span>
              </div>
              <span class="font-medium text-secondary-900 dark:text-secondary-100">Facebook</span>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-secondary-900 dark:text-secondary-100">4.2K</p>
              <p class="text-xs text-secondary-500 dark:text-secondary-400">followers</p>
            </div>
          </div>

          <div class="flex items-center justify-between p-3 rounded-lg bg-secondary-50 dark:bg-secondary-700">
            <div class="flex items-center space-x-3">
              <div
                class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span class="text-white text-sm font-bold">ig</span>
              </div>
              <span class="font-medium text-secondary-900 dark:text-secondary-100">Instagram</span>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-secondary-900 dark:text-secondary-100">3.1K</p>
              <p class="text-xs text-secondary-500 dark:text-secondary-400">followers</p>
            </div>
          </div>

          <div class="flex items-center justify-between p-3 rounded-lg bg-secondary-50 dark:bg-secondary-700">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center">
                <span class="text-white text-sm font-bold">tw</span>
              </div>
              <span class="font-medium text-secondary-900 dark:text-secondary-100">Twitter</span>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-secondary-900 dark:text-secondary-100">1.6K</p>
              <p class="text-xs text-secondary-500 dark:text-secondary-400">followers</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700">
      <div class="p-6 border-b border-secondary-200 dark:border-secondary-700">
        <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
          Recent Activity
        </h3>
      </div>
      <div class="p-6">
        <div class="space-y-4">
          <div class="flex items-start space-x-3">
            <div
              class="w-8 h-8 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <ArrowUpIcon class="w-4 h-4 text-success-600 dark:text-success-400" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm text-secondary-900 dark:text-secondary-100">
                <span class="font-medium">Instagram post</span> gained 150 new likes
              </p>
              <p class="text-xs text-secondary-500 dark:text-secondary-400 mt-1">2 hours ago</p>
            </div>
          </div>

          <div class="flex items-start space-x-3">
            <div
              class="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <UsersIcon class="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm text-secondary-900 dark:text-secondary-100">
                <span class="font-medium">Facebook page</span> gained 25 new followers
              </p>
              <p class="text-xs text-secondary-500 dark:text-secondary-400 mt-1">4 hours ago</p>
            </div>
          </div>

          <div class="flex items-start space-x-3">
            <div
              class="w-8 h-8 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <HeartIcon class="w-4 h-4 text-accent-600 dark:text-accent-400" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm text-secondary-900 dark:text-secondary-100">
                <span class="font-medium">Twitter post</span> received 50 retweets
              </p>
              <p class="text-xs text-secondary-500 dark:text-secondary-400 mt-1">6 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  EyeIcon,
  HeartIcon,
  UsersIcon,
  CursorArrowRaysIcon,
  ArrowUpIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'
</script>