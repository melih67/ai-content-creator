import { supabase } from '@/lib/supabase'
import type { Post, CreatePostRequest, AIGenerationRequest } from '@/types'
import type { Database } from '@/types/database'

type SupabasePost = Database['public']['Tables']['social_posts']['Row']
type SupabasePostInsert = Database['public']['Tables']['social_posts']['Insert']
type SupabasePostUpdate = Database['public']['Tables']['social_posts']['Update']

class SupabasePostsService {
  async getCompanyPosts(companyId: string): Promise<{ success: boolean; posts?: Post[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      const posts: Post[] = data.map(this.mapSupabasePostToPost)

      return { success: true, posts }
    } catch (error) {
      console.error('Get company posts error:', error)
      return { success: false, error: 'Failed to fetch posts' }
    }
  }

  async getUserPosts(userId: string): Promise<{ success: boolean; posts?: Post[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      const posts: Post[] = data.map(this.mapSupabasePostToPost)

      return { success: true, posts }
    } catch (error) {
      console.error('Get user posts error:', error)
      return { success: false, error: 'Failed to fetch posts' }
    }
  }

  async getPostById(postId: string): Promise<{ success: boolean; post?: Post; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .eq('id', postId)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      const post = this.mapSupabasePostToPost(data)

      return { success: true, post }
    } catch (error) {
      console.error('Get post by ID error:', error)
      return { success: false, error: 'Failed to fetch post' }
    }
  }

  async createPost(userId: string, companyId: string, postData: CreatePostRequest): Promise<{ success: boolean; post?: Post; error?: string }> {
    try {
      const newPost: SupabasePostInsert = {
        user_id: userId,
        company_id: companyId,
        title: postData.title || null,
        content: postData.content,
        platform: postData.platform,
        images: postData.images || null,
        hashtags: postData.hashtags || null,
        scheduled_at: postData.scheduledAt || null,
        ai_prompt: postData.aiPrompt || null,
        status: postData.status || 'draft'
      }

      const { data, error } = await supabase
        .from('social_posts')
        .insert(newPost)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      const post = this.mapSupabasePostToPost(data)

      return { success: true, post }
    } catch (error) {
      console.error('Create post error:', error)
      return { success: false, error: 'Failed to create post' }
    }
  }

  async updatePost(postId: string, updates: Partial<Post>): Promise<{ success: boolean; post?: Post; error?: string }> {
    try {
      const postUpdates: SupabasePostUpdate = {
        title: updates.title,
        content: updates.content,
        platform: updates.platform,
        images: updates.images,
        hashtags: updates.hashtags,
        scheduled_at: updates.scheduledAt,
        published_at: updates.publishedAt,
        ai_prompt: updates.aiPrompt,
        status: updates.status,
        engagement: updates.engagement,
        updated_at: new Date().toISOString()
      }

      // Remove undefined values
      Object.keys(postUpdates).forEach(key => {
        if (postUpdates[key as keyof SupabasePostUpdate] === undefined) {
          delete postUpdates[key as keyof SupabasePostUpdate]
        }
      })

      const { data, error } = await supabase
        .from('social_posts')
        .update(postUpdates)
        .eq('id', postId)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      const post = this.mapSupabasePostToPost(data)

      return { success: true, post }
    } catch (error) {
      console.error('Update post error:', error)
      return { success: false, error: 'Failed to update post' }
    }
  }

  async deletePost(postId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('social_posts')
        .delete()
        .eq('id', postId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Delete post error:', error)
      return { success: false, error: 'Failed to delete post' }
    }
  }

  async generateContent(request: AIGenerationRequest): Promise<{ success: boolean; content?: string; hashtags?: string[]; error?: string }> {
    try {
      // This would typically call an AI service like OpenAI
      // For now, we'll create a simple mock response
      const mockContent = this.generateMockContent(request)
      const mockHashtags = this.generateMockHashtags(request.platform, request.topic)

      // You can replace this with actual AI service integration
      // Example: const response = await openai.createCompletion({...})

      return {
        success: true,
        data: {
          content: mockContent,
          hashtags: mockHashtags,
          generatedAt: new Date(),
          confidence: 0.9,
          alternatives: []
        }
      }
    } catch (error) {
      console.error('Generate content error:', error)
      return { success: false, error: 'Failed to generate content' }
    }
  }

  async uploadImages(files: File[]): Promise<{ success: boolean; urls?: string[]; error?: string }> {
    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `post-images/${fileName}`

        const { data, error } = await supabase.storage
          .from('uploads')
          .upload(filePath, file)

        if (error) {
          throw error
        }

        const { data: { publicUrl } } = supabase.storage
          .from('uploads')
          .getPublicUrl(filePath)

        // Store file info in file_uploads table
        await supabase
          .from('file_uploads')
          .insert({
            filename: fileName,
            original_name: file.name,
            mime_type: file.type,
            size: file.size,
            url: publicUrl
          })

        return publicUrl
      })

      const urls = await Promise.all(uploadPromises)

      return { success: true, urls }
    } catch (error) {
      console.error('Upload images error:', error)
      return { success: false, error: 'Failed to upload images' }
    }
  }

  async getPostTemplates(platform?: string): Promise<{ success: boolean; templates?: any[]; error?: string }> {
    try {
      let query = supabase
        .from('post_templates')
        .select('*')
        .eq('is_public', true)

      if (platform) {
        query = query.eq('platform', platform)
      }

      const { data, error } = await query.order('usage_count', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, templates: data }
    } catch (error) {
      console.error('Get post templates error:', error)
      return { success: false, error: 'Failed to fetch templates' }
    }
  }

  private mapSupabasePostToPost(supabasePost: SupabasePost): Post {
    return {
      id: supabasePost.id,
      companyId: supabasePost.company_id,
      userId: supabasePost.user_id,
      title: supabasePost.title || undefined,
      content: supabasePost.content,
      platform: supabasePost.platform,
      images: supabasePost.images || [],
      hashtags: supabasePost.hashtags || [],
      scheduledAt: supabasePost.scheduled_at || undefined,
      publishedAt: supabasePost.published_at || undefined,
      aiPrompt: supabasePost.ai_prompt || undefined,
      status: supabasePost.status,
      engagement: supabasePost.engagement as { likes: number; shares: number; comments: number; reach: number } || { likes: 0, shares: 0, comments: 0, reach: 0 },
      createdAt: supabasePost.created_at,
      updatedAt: supabasePost.updated_at
    }
  }

  private generateMockContent(request: AIGenerationRequest): string {
    const topic = request.topic || 'your business';
    const templates = {
      facebook: [
        `🚀 Exciting news about ${topic}! Here's what you need to know...`,
        `💡 Did you know that ${topic} can transform your business? Let's explore how!`,
        `🌟 Today we're diving deep into ${topic}. Here are our top insights:`
      ],
      instagram: [
        `✨ ${topic} vibes ✨\n\nSwipe to see our latest insights! 👉`,
        `🔥 Hot take on ${topic}! 🔥\n\nWhat do you think? Drop your thoughts below! 👇`,
        `📸 Behind the scenes: ${topic}\n\nStay tuned for more! 💫`
      ],
      twitter: [
        `🧵 Thread: Everything you need to know about ${topic} 👇`,
        `Hot take: ${topic} is going to change everything. Here's why... 🔥`,
        `Quick question: What's your experience with ${topic}? 🤔`
      ],
      linkedin: [
        `Professional insight: ${topic} is reshaping our industry. Here's my analysis:`,
        `Thought leadership: The future of ${topic} and what it means for professionals`,
        `Industry update: Key trends in ${topic} that every professional should know`
      ],
      tiktok: [
        `POV: You're learning about ${topic} 👀 #${topic.replace(/\s+/g, '')}`,
        `This ${topic} hack will blow your mind! 🤯 #lifehack`,
        `Day in the life working with ${topic} ✨ #dayinthelife`
      ]
    }

    const platformTemplates = templates[request.platform] || templates.facebook
    const randomTemplate = platformTemplates[Math.floor(Math.random() * platformTemplates.length)]
    
    return randomTemplate
  }

  private generateMockHashtags(platform: string, topic?: string): string[] {
    const safeTopic = topic || 'business';
    const baseHashtags = [
      safeTopic.replace(/\s+/g, '').toLowerCase(),
      'business',
      'growth',
      'innovation'
    ]

    const platformSpecific = {
      instagram: ['instagood', 'photooftheday', 'follow', 'like4like'],
      tiktok: ['fyp', 'viral', 'trending', 'foryou'],
      twitter: ['thread', 'discussion', 'thoughts'],
      linkedin: ['professional', 'networking', 'career', 'industry'],
      facebook: ['community', 'share', 'discuss']
    }

    return [...baseHashtags, ...(platformSpecific[platform as keyof typeof platformSpecific] || [])]
      .slice(0, 8)
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
  }
}

export const supabasePostsService = new SupabasePostsService()