import { apiService } from './api'
import type { Company, ApiResponse, PaginatedResponse } from '@/types'

export interface CreateCompanyRequest {
  name: string
  description: string
  industry: string
  logo?: string
  website?: string
  phone?: string
  address?: string
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
  }
  brandColors: {
    primary: string
    secondary: string
    accent?: string
  }
  brandVoice: 'professional' | 'casual' | 'friendly' | 'authoritative' | 'creative'
  targetAudience?: string
  products?: string
  uniqueSellingPoints?: string
  preferredPlatforms?: string[]
  contentThemes?: string
}

export interface UpdateCompanyRequest extends Partial<CreateCompanyRequest> {
  id: string
}

export interface CompanyQueryParams {
  page?: number
  limit?: number
  search?: string
  industry?: string
  sortBy?: 'name' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

class CompanyService {
  async getCompanies(params?: CompanyQueryParams): Promise<PaginatedResponse<Company>> {
    return await apiService.get<Company[]>('/companies', params)
  }

  async getCompanyById(id: string): Promise<ApiResponse<Company>> {
    return await apiService.get<Company>(`/companies/${id}`)
  }

  async createCompany(companyData: CreateCompanyRequest): Promise<ApiResponse<Company>> {
    return await apiService.post<Company>('/companies', companyData)
  }

  async updateCompany(id: string, companyData: Partial<CreateCompanyRequest>): Promise<ApiResponse<Company>> {
    return await apiService.patch<Company>(`/companies/${id}`, companyData)
  }

  async deleteCompany(id: string): Promise<ApiResponse> {
    return await apiService.delete(`/companies/${id}`)
  }

  async uploadLogo(companyId: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<{ logoUrl: string }>> {
    return await apiService.upload<{ logoUrl: string }>(`/companies/${companyId}/logo`, file, onProgress)
  }

  async getCompanyAnalytics(companyId: string, period?: '7d' | '30d' | '90d' | '1y'): Promise<ApiResponse<any>> {
    return await apiService.get(`/companies/${companyId}/analytics`, { period })
  }

  async getCompanyPosts(companyId: string, params?: {
    page?: number
    limit?: number
    status?: 'draft' | 'generated' | 'scheduled' | 'published'
    platform?: string
  }): Promise<PaginatedResponse<any>> {
    return await apiService.get(`/companies/${companyId}/posts`, params)
  }

  async duplicateCompany(id: string, newName: string): Promise<ApiResponse<Company>> {
    return await apiService.post<Company>(`/companies/${id}/duplicate`, { name: newName })
  }

  async getCompanyTemplates(companyId: string): Promise<ApiResponse<any[]>> {
    return await apiService.get(`/companies/${companyId}/templates`)
  }

  async createCompanyTemplate(companyId: string, templateData: any): Promise<ApiResponse<any>> {
    return await apiService.post(`/companies/${companyId}/templates`, templateData)
  }

  async getCompanyBrandGuidelines(companyId: string): Promise<ApiResponse<any>> {
    return await apiService.get(`/companies/${companyId}/brand-guidelines`)
  }

  async updateCompanyBrandGuidelines(companyId: string, guidelines: any): Promise<ApiResponse<any>> {
    return await apiService.patch(`/companies/${companyId}/brand-guidelines`, guidelines)
  }

  async getCompanyTeamMembers(companyId: string): Promise<ApiResponse<any[]>> {
    return await apiService.get(`/companies/${companyId}/team`)
  }

  async inviteTeamMember(companyId: string, email: string, role: string): Promise<ApiResponse> {
    return await apiService.post(`/companies/${companyId}/team/invite`, { email, role })
  }

  async removeTeamMember(companyId: string, userId: string): Promise<ApiResponse> {
    return await apiService.delete(`/companies/${companyId}/team/${userId}`)
  }

  async updateTeamMemberRole(companyId: string, userId: string, role: string): Promise<ApiResponse> {
    return await apiService.patch(`/companies/${companyId}/team/${userId}`, { role })
  }

  async getCompanySubscription(companyId: string): Promise<ApiResponse<any>> {
    return await apiService.get(`/companies/${companyId}/subscription`)
  }

  async updateCompanySubscription(companyId: string, planId: string): Promise<ApiResponse<any>> {
    return await apiService.post(`/companies/${companyId}/subscription`, { planId })
  }

  async getCompanyUsage(companyId: string): Promise<ApiResponse<any>> {
    return await apiService.get(`/companies/${companyId}/usage`)
  }

  async exportCompanyData(companyId: string, format: 'json' | 'csv' | 'pdf'): Promise<ApiResponse<{ downloadUrl: string }>> {
    return await apiService.post(`/companies/${companyId}/export`, { format })
  }

  async getCompanyIntegrations(companyId: string): Promise<ApiResponse<any[]>> {
    return await apiService.get(`/companies/${companyId}/integrations`)
  }

  async connectIntegration(companyId: string, platform: string, credentials: any): Promise<ApiResponse> {
    return await apiService.post(`/companies/${companyId}/integrations/${platform}`, credentials)
  }

  async disconnectIntegration(companyId: string, platform: string): Promise<ApiResponse> {
    return await apiService.delete(`/companies/${companyId}/integrations/${platform}`)
  }

  async testIntegration(companyId: string, platform: string): Promise<ApiResponse<{ status: string }>> {
    return await apiService.post(`/companies/${companyId}/integrations/${platform}/test`)
  }
}

export const companyService = new CompanyService()
export default companyService