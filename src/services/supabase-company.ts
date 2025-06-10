import { supabase } from '@/lib/supabase'
import type { Company, CreateCompanyRequest } from '@/types'
import type { Database } from '@/types/database'

type SupabaseCompany = Database['public']['Tables']['companies']['Row']
type SupabaseCompanyInsert = Database['public']['Tables']['companies']['Insert']
type SupabaseCompanyUpdate = Database['public']['Tables']['companies']['Update']

class SupabaseCompanyService {
  async getUserCompanies(userId: string): Promise<{ success: boolean; companies?: Company[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      const companies: Company[] = data.map(this.mapSupabaseCompanyToCompany)

      return { success: true, companies }
    } catch (error) {
      console.error('Get user companies error:', error)
      return { success: false, error: 'Failed to fetch companies' }
    }
  }

  async getCompanyById(companyId: string): Promise<{ success: boolean; company?: Company; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      const company = this.mapSupabaseCompanyToCompany(data)

      return { success: true, company }
    } catch (error) {
      console.error('Get company by ID error:', error)
      return { success: false, error: 'Failed to fetch company' }
    }
  }

  async createCompany(userId: string, companyData: CreateCompanyRequest): Promise<{ success: boolean; company?: Company; error?: string }> {
    try {
      const newCompany: SupabaseCompanyInsert = {
        user_id: userId,
        name: companyData.name,
        description: companyData.description || null,
        industry: companyData.industry || null,
        website: companyData.website || null,
        phone: companyData.phone || null,
        address: companyData.address || null,
        target_audience: companyData.targetAudience || null,
        products: companyData.products || null,
        unique_selling_points: companyData.uniqueSellingPoints || null,
        preferred_platforms: companyData.preferredPlatforms || null,
        content_themes: companyData.contentThemes || null,
        social_media: companyData.socialMedia || {},
        brand_colors: companyData.brandColors || { primary: '#3B82F6', secondary: '#64748B' },
        brand_voice: companyData.brandVoice || 'professional'
      }

      const { data, error } = await supabase
        .from('companies')
        .insert(newCompany)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      const company = this.mapSupabaseCompanyToCompany(data)

      return { success: true, company }
    } catch (error) {
      console.error('Create company error:', error)
      return { success: false, error: 'Failed to create company' }
    }
  }

  async updateCompany(companyId: string, updates: Partial<Company>): Promise<{ success: boolean; company?: Company; error?: string }> {
    try {
      const companyUpdates: SupabaseCompanyUpdate = {
        name: updates.name,
        description: updates.description,
        industry: updates.industry,
        logo: updates.logo,
        website: updates.website,
        phone: updates.phone,
        address: updates.address,
        target_audience: updates.targetAudience,
        products: updates.products,
        unique_selling_points: updates.uniqueSellingPoints,
        preferred_platforms: updates.preferredPlatforms,
        content_themes: updates.contentThemes,
        social_media: updates.socialMedia,
        brand_colors: updates.brandColors,
        brand_voice: updates.brandVoice,
        updated_at: new Date().toISOString()
      }

      // Remove undefined values
      Object.keys(companyUpdates).forEach(key => {
        if (companyUpdates[key as keyof SupabaseCompanyUpdate] === undefined) {
          delete companyUpdates[key as keyof SupabaseCompanyUpdate]
        }
      })

      const { data, error } = await supabase
        .from('companies')
        .update(companyUpdates)
        .eq('id', companyId)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      const company = this.mapSupabaseCompanyToCompany(data)

      return { success: true, company }
    } catch (error) {
      console.error('Update company error:', error)
      return { success: false, error: 'Failed to update company' }
    }
  }

  async deleteCompany(companyId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // First, delete all related posts
      await supabase
        .from('social_posts')
        .delete()
        .eq('company_id', companyId)

      // Then delete the company
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Delete company error:', error)
      return { success: false, error: 'Failed to delete company' }
    }
  }

  async uploadLogo(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `company-logos/${fileName}`

      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(filePath, file)

      if (error) {
        return { success: false, error: error.message }
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

      return { success: true, url: publicUrl }
    } catch (error) {
      console.error('Upload logo error:', error)
      return { success: false, error: 'Failed to upload logo' }
    }
  }

  private mapSupabaseCompanyToCompany(supabaseCompany: SupabaseCompany): Company {
    return {
      id: supabaseCompany.id,
      userId: supabaseCompany.user_id,
      name: supabaseCompany.name,
      description: supabaseCompany.description || undefined,
      industry: supabaseCompany.industry || undefined,
      logo: supabaseCompany.logo || undefined,
      website: supabaseCompany.website || undefined,
      phone: supabaseCompany.phone || undefined,
      address: supabaseCompany.address || undefined,
      targetAudience: supabaseCompany.target_audience || undefined,
      products: supabaseCompany.products || undefined,
      uniqueSellingPoints: supabaseCompany.unique_selling_points || undefined,
      preferredPlatforms: supabaseCompany.preferred_platforms || [],
      contentThemes: supabaseCompany.content_themes || undefined,
      socialMedia: supabaseCompany.social_media as Record<string, any> || {},
      brandColors: supabaseCompany.brand_colors as { primary: string; secondary: string } || { primary: '#3B82F6', secondary: '#64748B' },
      brandVoice: supabaseCompany.brand_voice,
      createdAt: supabaseCompany.created_at,
      updatedAt: supabaseCompany.updated_at
    }
  }
}

export const supabaseCompanyService = new SupabaseCompanyService()