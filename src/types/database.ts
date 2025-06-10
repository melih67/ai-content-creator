export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          avatar: string | null
          subscription: 'free' | 'starter' | 'professional' | 'enterprise'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          avatar?: string | null
          subscription?: 'free' | 'starter' | 'professional' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          avatar?: string | null
          subscription?: 'free' | 'starter' | 'professional' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          industry: string | null
          logo: string | null
          website: string | null
          phone: string | null
          address: string | null
          target_audience: string | null
          products: string | null
          unique_selling_points: string | null
          preferred_platforms: string[] | null
          content_themes: string | null
          social_media: Json
          brand_colors: Json
          brand_voice: 'professional' | 'casual' | 'friendly' | 'authoritative' | 'creative'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          industry?: string | null
          logo?: string | null
          website?: string | null
          phone?: string | null
          address?: string | null
          target_audience?: string | null
          products?: string | null
          unique_selling_points?: string | null
          preferred_platforms?: string[] | null
          content_themes?: string | null
          social_media?: Json
          brand_colors?: Json
          brand_voice?: 'professional' | 'casual' | 'friendly' | 'authoritative' | 'creative'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          industry?: string | null
          logo?: string | null
          website?: string | null
          phone?: string | null
          address?: string | null
          target_audience?: string | null
          products?: string | null
          unique_selling_points?: string | null
          preferred_platforms?: string[] | null
          content_themes?: string | null
          social_media?: Json
          brand_colors?: Json
          brand_voice?: 'professional' | 'casual' | 'friendly' | 'authoritative' | 'creative'
          created_at?: string
          updated_at?: string
        }
      }
      social_posts: {
        Row: {
          id: string
          company_id: string
          user_id: string
          title: string | null
          content: string
          platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok'
          images: string[] | null
          hashtags: string[] | null
          scheduled_at: string | null
          published_at: string | null
          ai_prompt: string | null
          status: 'draft' | 'generated' | 'scheduled' | 'published'
          engagement: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          user_id: string
          title?: string | null
          content: string
          platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok'
          images?: string[] | null
          hashtags?: string[] | null
          scheduled_at?: string | null
          published_at?: string | null
          ai_prompt?: string | null
          status?: 'draft' | 'generated' | 'scheduled' | 'published'
          engagement?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          user_id?: string
          title?: string | null
          content?: string
          platform?: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok'
          images?: string[] | null
          hashtags?: string[] | null
          scheduled_at?: string | null
          published_at?: string | null
          ai_prompt?: string | null
          status?: 'draft' | 'generated' | 'scheduled' | 'published'
          engagement?: Json
          created_at?: string
          updated_at?: string
        }
      }
      post_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string | null
          platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | null
          template: string
          variables: string[] | null
          created_by: string | null
          is_public: boolean
          usage_count: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category?: string | null
          platform?: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | null
          template: string
          variables?: string[] | null
          created_by?: string | null
          is_public?: boolean
          usage_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string | null
          platform?: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | null
          template?: string
          variables?: string[] | null
          created_by?: string | null
          is_public?: boolean
          usage_count?: number
          created_at?: string
        }
      }
      file_uploads: {
        Row: {
          id: string
          filename: string
          original_name: string
          mime_type: string
          size: number
          url: string
          uploaded_at: string
        }
        Insert: {
          id?: string
          filename: string
          original_name: string
          mime_type: string
          size: number
          url: string
          uploaded_at?: string
        }
        Update: {
          id?: string
          filename?: string
          original_name?: string
          mime_type?: string
          size?: number
          url?: string
          uploaded_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'info' | 'success' | 'warning' | 'error'
          title: string
          message: string
          action_url: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'info' | 'success' | 'warning' | 'error'
          title: string
          message: string
          action_url?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'info' | 'success' | 'warning' | 'error'
          title?: string
          message?: string
          action_url?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}