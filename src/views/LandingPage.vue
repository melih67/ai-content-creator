<template>
  <div
    class="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 dark:from-secondary-950 dark:via-secondary-900 dark:to-secondary-950">
    <!-- Navigation -->
    <nav class="relative z-50 px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="text-2xl font-bold gradient-ai-text">Aiva</span>
        </div>

        <div class="hidden md:flex items-center space-x-8">
          <a href="#features"
            class="text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</a>
          <a href="#pricing"
            class="text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Pricing</a>
          <a href="#about"
            class="text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About</a>
        </div>

        <div class="flex items-center space-x-4">
          <ThemeToggle />
          <router-link to="/login" class="btn-ghost">Sign In</router-link>
          <router-link to="/register" class="btn-primary">Get Started</router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative px-6 py-20 overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow">
        </div>
        <div
          class="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-1000">
        </div>
      </div>

      <div class="relative max-w-7xl mx-auto text-center">
        <div class="animate-fade-in">
          <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span class="gradient-ai-text">AI-Powered</span><br>
            <span class="text-secondary-900 dark:text-secondary-100">Social Media</span><br>
            <span class="text-secondary-700 dark:text-secondary-300">Content Generator</span>
          </h1>

          <p
            class="text-xl md:text-2xl text-secondary-600 dark:text-secondary-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your business social media presence with AI-powered content generation.
            Create personalized, engaging posts for all your companies in seconds.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button @click="loginAsDemo" class="btn-primary text-lg px-8 py-4 hover-lift">
              Try Demo Now
              <ArrowRightIcon class="w-5 h-5 ml-2" />
            </button>
            <router-link to="/register" class="btn-secondary text-lg px-8 py-4 hover-lift">
              Start Free Trial
            </router-link>
          </div>

          <div class="flex items-center justify-center space-x-8 text-sm text-secondary-500 dark:text-secondary-400">
            <div class="flex items-center space-x-2">
              <CheckIcon class="w-4 h-4 text-success-500" />
              <span>No Credit Card Required</span>
            </div>
            <div class="flex items-center space-x-2">
              <CheckIcon class="w-4 h-4 text-success-500" />
              <span>14-Day Free Trial</span>
            </div>
            <div class="flex items-center space-x-2">
              <CheckIcon class="w-4 h-4 text-success-500" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="px-6 py-20 bg-white/50 dark:bg-secondary-900/50 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-6 gradient-ai-text">Powerful Features</h2>
          <p class="text-xl text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto">
            Everything you need to create, manage, and optimize your social media content with AI
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard v-for="(feature, index) in features" :key="feature.title" :feature="feature"
            :delay="index * 100" />
        </div>
      </div>
    </section>

    <!-- Demo Section -->
    <section class="px-6 py-20">
      <div class="max-w-7xl mx-auto text-center">
        <h2 class="text-4xl md:text-5xl font-bold mb-6 text-secondary-900 dark:text-secondary-100">
          See It In Action
        </h2>
        <p class="text-xl text-secondary-600 dark:text-secondary-400 mb-12 max-w-3xl mx-auto">
          Watch how Aiva transforms your business information into engaging social media content
        </p>

        <div class="relative max-w-4xl mx-auto">
          <div
            class="card-elevated p-8 bg-gradient-to-br from-white to-secondary-50 dark:from-secondary-800 dark:to-secondary-900">
            <div
              class="aspect-video bg-secondary-100 dark:bg-secondary-700 rounded-lg flex items-center justify-center">
              <div class="text-center">
                <div class="w-16 h-16 bg-gradient-ai rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlayIcon class="w-8 h-8 text-white" />
                </div>
                <p class="text-secondary-600 dark:text-secondary-400">Interactive Demo Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="px-6 py-20 bg-gradient-ai">
      <div class="max-w-4xl mx-auto text-center text-white">
        <h2 class="text-4xl md:text-5xl font-bold mb-6">
          Ready to Transform Your Social Media?
        </h2>
        <p class="text-xl mb-8 opacity-90">
          Join thousands of businesses already using Aiva to create amazing content
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button @click="loginAsDemo"
            class="bg-white text-primary-600 hover:bg-secondary-50 font-medium px-8 py-4 rounded-lg transition-all duration-200 hover-lift">
            Try Demo Now
          </button>
          <router-link to="/register"
            class="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-medium px-8 py-4 rounded-lg transition-all duration-200 hover-lift">
            Start Free Trial
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="px-6 py-12 bg-secondary-900 dark:bg-secondary-950 text-secondary-300">
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center space-x-2 mb-4">
              <span class="text-2xl font-bold text-white">Aiva</span>
            </div>
            <p class="text-secondary-400">
              AI-powered social media content generation for modern businesses.
            </p>
          </div>

          <div>
            <h3 class="font-semibold text-white mb-4">Product</h3>
            <ul class="space-y-2">
              <li><a href="#" class="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" class="hover:text-white transition-colors">API</a></li>
            </ul>
          </div>

          <div>
            <h3 class="font-semibold text-white mb-4">Company</h3>
            <ul class="space-y-2">
              <li><a href="#" class="hover:text-white transition-colors">About</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h3 class="font-semibold text-white mb-4">Support</h3>
            <ul class="space-y-2">
              <li><a href="#" class="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-secondary-800 mt-8 pt-8 text-center">
          <p>&copy; 2024 Aiva. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import FeatureCard from '@/components/landing/FeatureCard.vue'
import { ArrowRightIcon, CheckIcon, PlayIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const userStore = useUserStore()

const features = ref([
  {
    icon: '🤖',
    title: 'AI Content Generation',
    description: 'Generate personalized social media posts using advanced AI that understands your brand voice and audience.'
  },
  {
    icon: '🏢',
    title: 'Multi-Company Management',
    description: 'Manage multiple companies and brands from a single dashboard with unique profiles and settings.'
  },
  {
    icon: '📱',
    title: 'Multi-Platform Support',
    description: 'Create content optimized for Facebook, Instagram, Twitter, LinkedIn, and more platforms.'
  },
  {
    icon: '📊',
    title: 'Analytics & Insights',
    description: 'Track performance, engagement, and growth with comprehensive analytics and reporting.'
  },
  {
    icon: '🎨',
    title: 'Brand Customization',
    description: 'Maintain brand consistency with custom colors, voice, and style preferences.'
  },
  {
    icon: '⚡',
    title: 'Smart Templates',
    description: 'Use pre-built templates or create custom ones for different post types and occasions.'
  }
])

const loginAsDemo = async () => {
  await userStore.loginAsDemo()
  router.push('/dashboard')
}
</script>