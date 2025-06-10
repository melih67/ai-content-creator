<template>
  <div class="card p-6 hover-lift hover-glow transition-all duration-300 animate-fade-in"
    :style="{ animationDelay: `${delay}ms` }">
    <div class="text-4xl mb-4">{{ feature.icon }}</div>
    <h3 class="text-xl font-semibold mb-3 text-secondary-900 dark:text-secondary-100">
      {{ feature.title }}
    </h3>
    <p class="text-secondary-600 dark:text-secondary-400 leading-relaxed">
      {{ feature.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Feature {
  icon: string
  title: string
  description: string
}

interface Props {
  feature: Feature
  delay?: number
}

withDefaults(defineProps<Props>(), {
  delay: 0
})
</script>