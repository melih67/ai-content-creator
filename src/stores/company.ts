import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Company, CreateCompanyRequest } from '@/types'
import { useUserStore } from './user'
import { supabaseCompanyService } from '@/services/supabase-company'

export const useCompanyStore = defineStore('company', () => {
  const companies = ref<Company[]>([])
  const currentCompany = ref<Company | null>(null)
  const isLoading = ref(false)

  const userStore = useUserStore()

  // Computed properties
  const userCompanies = computed(() => {
    if (!userStore.currentUser) return []
    return companies.value.filter(company => company.userId === userStore.currentUser!.id)
  })

  const hasCompanies = computed(() => userCompanies.value.length > 0)

  // Initialize companies from localStorage
  const initializeCompanies = () => {
    const savedCompanies = localStorage.getItem('companies')
    if (savedCompanies) {
      try {
        const companiesData = JSON.parse(savedCompanies)
        companies.value = companiesData.map((company: any) => ({
          ...company,
          createdAt: new Date(company.createdAt),
          updatedAt: new Date(company.updatedAt)
        }))

        // Restore current company selection from localStorage
        const savedCurrentCompanyId = localStorage.getItem('currentCompanyId')
        if (savedCurrentCompanyId) {
          const savedCompany = userCompanies.value.find(c => c.id === savedCurrentCompanyId)
          if (savedCompany) {
            currentCompany.value = savedCompany
          } else {
            // If saved company not found, set to first user company
            currentCompany.value = userCompanies.value.length > 0 ? userCompanies.value[0] : null
          }
        } else if (!currentCompany.value && userCompanies.value.length > 0) {
          // Set current company to first user company if none selected
          currentCompany.value = userCompanies.value[0]
        }
      } catch (error) {
        console.error('Error parsing saved companies data:', error)
        localStorage.removeItem('companies')
      }
    }
  }

  // Save companies to localStorage
  const saveCompanies = () => {
    localStorage.setItem('companies', JSON.stringify(companies.value))
  }

  // Create new company
  const createCompany = async (companyData: Omit<Company, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Company | null> => {
    if (!userStore.currentUser) return null

    isLoading.value = true

    try {
      const createData: CreateCompanyRequest = {
        name: companyData.name,
        description: companyData.description,
        website: companyData.website,
        industry: companyData.industry,
        logo: companyData.logo,
        brandColors: companyData.brandColors,
        brandGuidelines: companyData.brandGuidelines
      }

      const userStore = useUserStore()
      if (!userStore.currentUser) {
        throw new Error('User not authenticated')
      }

      const response = await supabaseCompanyService.createCompany(userStore.currentUser.id, createData)

      if (response.success && response.company) {
        companies.value.push(response.company)
        saveCompanies()

        // Set as current company if it's the first one
        if (userCompanies.value.length === 1) {
          setCurrentCompany(response.company)
        }

        return response.company
      }

      return null
    } catch (error) {
      console.error('Error creating company:', error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Update company
  const updateCompany = async (companyId: string, updates: Partial<Company>): Promise<boolean> => {
    isLoading.value = true

    try {
      const response = await supabaseCompanyService.updateCompany(companyId, updates)

      if (response.success && response.company) {
        const companyIndex = companies.value.findIndex(c => c.id === companyId)
        if (companyIndex !== -1) {
          companies.value[companyIndex] = response.company

          // Update current company if it's the one being updated
          if (currentCompany.value?.id === companyId) {
            currentCompany.value = response.company
          }

          saveCompanies()
        }
        return true
      }

      return false
    } catch (error) {
      console.error('Error updating company:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Delete company
  const deleteCompany = async (companyId: string): Promise<boolean> => {
    isLoading.value = true

    try {
      const response = await supabaseCompanyService.deleteCompany(companyId)

      if (response.success) {
        const companyIndex = companies.value.findIndex(c => c.id === companyId)
        if (companyIndex !== -1) {
          companies.value.splice(companyIndex, 1)

          // Update current company if the deleted one was selected
          if (currentCompany.value?.id === companyId) {
            const newCurrentCompany = userCompanies.value.length > 0 ? userCompanies.value[0] : null
            setCurrentCompany(newCurrentCompany)
          }

          saveCompanies()
        }
        return true
      }

      return false
    } catch (error) {
      console.error('Error deleting company:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Set current company
  const setCurrentCompany = (company: Company | null) => {
    currentCompany.value = company
    // Save current company selection to localStorage
    if (company) {
      localStorage.setItem('currentCompanyId', company.id)
    } else {
      localStorage.removeItem('currentCompanyId')
    }
  }

  // Get company by ID
  const getCompanyById = (id: string): Company | undefined => {
    return companies.value.find(company => company.id === id)
  }

  // Clear all data (for logout)
  const clearData = () => {
    companies.value = []
    currentCompany.value = null
    localStorage.removeItem('currentCompanyId')
  }

  return {
    companies,
    currentCompany,
    isLoading,
    userCompanies,
    hasCompanies,
    initializeCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    setCurrentCompany,
    getCompanyById,
    clearData
  }
})