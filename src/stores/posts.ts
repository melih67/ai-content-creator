import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SocialPost, AIGenerationRequest } from '@/types'
import { useUserStore } from './user'
import { useCompanyStore } from './company'
import { supabasePostsService } from '@/services/supabase-posts'

export const usePostsStore = defineStore('posts', () => {
  const posts = ref<SocialPost[]>([])
  const isLoading = ref(false)
  const isGenerating = ref(false)

  const userStore = useUserStore()
  const companyStore = useCompanyStore()

  // Computed properties
  const userPosts = computed(() => {
    if (!userStore.currentUser) return []
    return posts.value.filter(post => post.userId === userStore.currentUser!.id)
  })

  const currentCompanyPosts = computed(() => {
    if (!companyStore.currentCompany) return []
    return posts.value.filter(post => post.companyId === companyStore.currentCompany!.id)
  })

  const draftPosts = computed(() => {
    return currentCompanyPosts.value.filter(post => post.status === 'draft')
  })

  const publishedPosts = computed(() => {
    return currentCompanyPosts.value.filter(post => post.status === 'published')
  })

  const scheduledPosts = computed(() => {
    return currentCompanyPosts.value.filter(post => post.status === 'scheduled')
  })

  // Initialize posts from localStorage
  const initializePosts = () => {
    const savedPosts = localStorage.getItem('posts')
    if (savedPosts) {
      try {
        const postsData = JSON.parse(savedPosts)
        posts.value = postsData.map((post: any) => ({
          ...post,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt),
          scheduledAt: post.scheduledAt ? new Date(post.scheduledAt) : undefined,
          publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined
        }))
      } catch (error) {
        console.error('Error parsing saved posts data:', error)
        localStorage.removeItem('posts')
      }
    }
  }

  // Save posts to localStorage
  const savePosts = () => {
    localStorage.setItem('posts', JSON.stringify(posts.value))
  }

  // AI generation function
  const generateContent = async (request: AIGenerationRequest): Promise<AIGenerationResponse | null> => {
    isGenerating.value = true

    try {
      const response = await supabasePostsService.generateContent(request)
      
      if (response.success && response.data) {
        return response.data
      }
      
      return null
    } catch (error) {
      console.error('Error generating content:', error)
      return null
    } finally {
      isGenerating.value = false
    }
  }

  // Create new post
  const createPost = async (postData: Omit<SocialPost, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<SocialPost | null> => {
    if (!userStore.currentUser || !companyStore.currentCompany) return null

    isLoading.value = true

    try {
      const response = await supabasePostsService.createPost({
        ...postData,
        user_id: userStore.currentUser.id,
        company_id: companyStore.currentCompany.id
      })
      
      if (response.success && response.post) {
        posts.value.unshift(response.post) // Add to beginning for chronological order
        savePosts()
        return response.post
      }
      
      return null
    } catch (error) {
      console.error('Error creating post:', error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Update post
  const updatePost = async (postId: string, updates: Partial<SocialPost>): Promise<boolean> => {
    isLoading.value = true

    try {
      const response = await supabasePostsService.updatePost(postId, updates)
      
      if (response.success && response.post) {
        const postIndex = posts.value.findIndex(p => p.id === postId)
        if (postIndex !== -1) {
          posts.value[postIndex] = response.post
          savePosts()
        }
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error updating post:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Delete post
  const deletePost = async (postId: string): Promise<boolean> => {
    isLoading.value = true

    try {
      const response = await supabasePostsService.deletePost(postId)
      
      if (response.success) {
        const postIndex = posts.value.findIndex(p => p.id === postId)
        if (postIndex !== -1) {
          posts.value.splice(postIndex, 1)
          savePosts()
        }
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error deleting post:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Get post by ID
  const getPostById = (id: string): SocialPost | undefined => {
    return posts.value.find(post => post.id === id)
  }

  // Clear all data (for logout)
  const clearData = () => {
    posts.value = []
  }

  // Mock content generation helpers
  const generateMockContent = (request: AIGenerationRequest, company: any, variant: string = 'main'): string => {
    const templates = {
      announcement: [
        `🎉 Exciting news from ${company.name}! ${request.topic}. We're thrilled to share this milestone with our amazing community!`,
        `📢 Big announcement! ${company.name} is proud to present ${request.topic}. This marks another step forward in our journey!`,
        `✨ We're excited to announce ${request.topic}! At ${company.name}, we're always pushing boundaries and delivering excellence.`
      ],
      promotion: [
        `🔥 Special offer alert! ${request.topic} at ${company.name}. Don't miss out on this incredible opportunity!`,
        `💫 Limited time offer: ${request.topic}! ${company.name} is bringing you exceptional value.`,
        `🎯 Exclusive deal: ${request.topic}. Experience the ${company.name} difference today!`
      ],
      'behind-the-scenes': [
        `👀 Behind the scenes at ${company.name}: ${request.topic}. Here's how we make the magic happen!`,
        `🎬 Take a peek behind the curtain! ${request.topic} at ${company.name}. Our team's dedication shows in every detail.`,
        `🔍 Ever wondered how we do it? ${request.topic} - a glimpse into the ${company.name} process.`
      ],
      'product-showcase': [
        `✨ Spotlight on ${request.topic}! ${company.name} is proud to showcase our latest innovation.`,
        `🌟 Introducing ${request.topic} from ${company.name}. Designed with you in mind, crafted with excellence.`,
        `🚀 Meet ${request.topic}! Another breakthrough from the ${company.name} team.`
      ]
    }

    const categoryTemplates = templates[request.postType as keyof typeof templates] || templates.announcement
    const baseIndex = variant === 'alternative1' ? 1 : variant === 'alternative2' ? 2 : 0
    return categoryTemplates[baseIndex % categoryTemplates.length]
  }

  const generateMockHashtags = (request: AIGenerationRequest, company: any): string[] => {
    const baseHashtags = [
      company.name ? company.name.toLowerCase().replace(/\s+/g, '') : 'company',
      company.industry ? company.industry.toLowerCase() : 'business',
      request.platform,
      request.postType ? request.postType.replace('-', '') : 'post'
    ]

    const industryHashtags: Record<string, string[]> = {
      technology: ['tech', 'innovation', 'digital', 'future', 'ai'],
      construction: ['construction', 'building', 'architecture', 'design', 'quality'],
      marketing: ['marketing', 'branding', 'growth', 'strategy', 'success'],
      healthcare: ['health', 'wellness', 'care', 'medical', 'innovation']
    }

    const industryKey = company.industry ? company.industry.toLowerCase() : 'business'
    const additional = industryHashtags[industryKey] || ['business', 'professional', 'quality']

    return [...baseHashtags, ...additional.slice(0, 3)]
  }

  return {
    posts,
    isLoading,
    isGenerating,
    userPosts,
    currentCompanyPosts,
    draftPosts,
    publishedPosts,
    scheduledPosts,
    initializePosts,
    generateContent,
    createPost,
    updatePost,
    deletePost,
    getPostById,
    clearData
  }
})