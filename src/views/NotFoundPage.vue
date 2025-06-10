<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
    <h1 class="text-6xl font-bold mb-4">404</h1>
    <p class="text-2xl mb-8">Oops! Page Not Found.</p>
    <p class="text-lg mb-8">The page you are looking for does not exist or has been moved.</p>
    <router-link to="/" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
      Go to Homepage
    </router-link>
  </div>
</template>

<script setup lang="ts">
// No script needed for this simple page
</script>

<style scoped>
/* You can add page-specific styles here if needed */
</style>