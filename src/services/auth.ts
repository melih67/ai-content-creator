import { apiService } from './api'
import type { User, ApiResponse } from '@/types'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface LoginResponse {
  user: User
  token: string
  refreshToken: string
}

export interface RefreshTokenResponse {
  token: string
  refreshToken: string
}

class AuthService {
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiService.post<LoginResponse>('/auth/login', credentials)
    
    if (response.success && response.data) {
      // Store tokens
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('refreshToken', response.data.refreshToken)
      localStorage.setItem('currentUser', JSON.stringify(response.data.user))
    }
    
    return response
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiService.post<LoginResponse>('/auth/register', userData)
    
    if (response.success && response.data) {
      // Store tokens
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('refreshToken', response.data.refreshToken)
      localStorage.setItem('currentUser', JSON.stringify(response.data.user))
    }
    
    return response
  }

  async logout(): Promise<ApiResponse> {
    const refreshToken = localStorage.getItem('refreshToken')
    
    // Call logout endpoint to invalidate tokens
    const response = await apiService.post('/auth/logout', { refreshToken })
    
    // Clear local storage regardless of API response
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('currentUser')
    localStorage.removeItem('companies')
    localStorage.removeItem('currentCompanyId')
    localStorage.removeItem('posts')
    
    return response
  }

  async refreshToken(): Promise<ApiResponse<RefreshTokenResponse>> {
    const refreshToken = localStorage.getItem('refreshToken')
    
    if (!refreshToken) {
      return {
        success: false,
        message: 'No refresh token available'
      }
    }
    
    const response = await apiService.post<RefreshTokenResponse>('/auth/refresh', { refreshToken })
    
    if (response.success && response.data) {
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('refreshToken', response.data.refreshToken)
    }
    
    return response
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    return await apiService.post('/auth/forgot-password', { email })
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse> {
    return await apiService.post('/auth/reset-password', { token, password })
  }

  async verifyEmail(token: string): Promise<ApiResponse> {
    return await apiService.post('/auth/verify-email', { token })
  }

  async resendVerification(email: string): Promise<ApiResponse> {
    return await apiService.post('/auth/resend-verification', { email })
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    return await apiService.post('/auth/change-password', {
      currentPassword,
      newPassword
    })
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await apiService.patch<User>('/auth/profile', userData)
    
    if (response.success && response.data) {
      localStorage.setItem('currentUser', JSON.stringify(response.data))
    }
    
    return response
  }

  async deleteAccount(): Promise<ApiResponse> {
    const response = await apiService.delete('/auth/account')
    
    if (response.success) {
      // Clear all local data
      localStorage.clear()
    }
    
    return response
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken')
    const user = localStorage.getItem('currentUser')
    return !!(token && user)
  }

  // Get current user from localStorage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser')
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        return {
          ...userData,
          createdAt: new Date(userData.createdAt),
          lastLoginAt: userData.lastLoginAt ? new Date(userData.lastLoginAt) : undefined
        }
      } catch {
        return null
      }
    }
    return null
  }

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('authToken')
  }
}

export const authService = new AuthService()
export default authService