import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type FileUpload = Database['public']['Tables']['file_uploads']['Row']
type FileUploadInsert = Database['public']['Tables']['file_uploads']['Insert']

class SupabaseStorageService {
  private readonly BUCKET_NAME = 'uploads'

  async uploadFile(file: File, folder: string = 'general'): Promise<{
    success: boolean
    fileUpload?: FileUpload
    error?: string
  }> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return { success: false, error: uploadError.message }
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(fileName)

      // Save file metadata to database
      const fileRecord: FileUploadInsert = {
        filename: fileName,
        original_name: file.name,
        mime_type: file.type,
        size: file.size,
        url: urlData.publicUrl
      }

      const { data: dbData, error: dbError } = await supabase
        .from('file_uploads')
        .insert(fileRecord)
        .select()
        .single()

      if (dbError) {
        console.error('Database error:', dbError)
        // Try to clean up uploaded file
        await this.deleteFile(fileName)
        return { success: false, error: dbError.message }
      }

      return { success: true, fileUpload: dbData }
    } catch (error) {
      console.error('Error in uploadFile:', error)
      return { success: false, error: 'Failed to upload file' }
    }
  }

  async uploadImage(file: File, folder: string = 'images'): Promise<{
    success: boolean
    fileUpload?: FileUpload
    error?: string
  }> {
    // Validate that it's an image
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File must be an image' }
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return { success: false, error: 'Image must be smaller than 5MB' }
    }

    return this.uploadFile(file, folder)
  }

  async uploadCompanyLogo(file: File, companyId: string): Promise<{
    success: boolean
    fileUpload?: FileUpload
    error?: string
  }> {
    return this.uploadImage(file, `companies/${companyId}/logos`)
  }

  async uploadPostImage(file: File, postId: string): Promise<{
    success: boolean
    fileUpload?: FileUpload
    error?: string
  }> {
    return this.uploadImage(file, `posts/${postId}/images`)
  }

  async uploadUserAvatar(file: File, userId: string): Promise<{
    success: boolean
    fileUpload?: FileUpload
    error?: string
  }> {
    return this.uploadImage(file, `users/${userId}/avatars`)
  }

  async uploadUserAvatar(file: File, userId: string): Promise<{
    success: boolean
    fileUpload?: FileUpload
    error?: string
  }> {
    return this.uploadImage(file, `users/${userId}/avatars`)
  }

  async deleteFile(fileName: string): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([fileName])

      if (storageError) {
        console.error('Storage deletion error:', storageError)
        return { success: false, error: storageError.message }
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('file_uploads')
        .delete()
        .eq('filename', fileName)

      if (dbError) {
        console.error('Database deletion error:', dbError)
        return { success: false, error: dbError.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error in deleteFile:', error)
      return { success: false, error: 'Failed to delete file' }
    }
  }

  async deleteFileById(fileId: string): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      // Get file info first
      const { data: fileData, error: fetchError } = await supabase
        .from('file_uploads')
        .select('filename')
        .eq('id', fileId)
        .single()

      if (fetchError || !fileData) {
        return { success: false, error: 'File not found' }
      }

      return this.deleteFile(fileData.filename)
    } catch (error) {
      console.error('Error in deleteFileById:', error)
      return { success: false, error: 'Failed to delete file' }
    }
  }

  async getFileInfo(fileId: string): Promise<{
    success: boolean
    fileUpload?: FileUpload
    error?: string
  }> {
    try {
      const { data, error } = await supabase
        .from('file_uploads')
        .select('*')
        .eq('id', fileId)
        .single()

      if (error) {
        console.error('Error fetching file info:', error)
        return { success: false, error: error.message }
      }

      return { success: true, fileUpload: data }
    } catch (error) {
      console.error('Error in getFileInfo:', error)
      return { success: false, error: 'Failed to fetch file info' }
    }
  }

  async listUserFiles(userId: string): Promise<{
    success: boolean
    files?: FileUpload[]
    error?: string
  }> {
    try {
      // This would require adding user_id to file_uploads table
      // For now, we'll return all files (in a real app, you'd filter by user)
      const { data, error } = await supabase
        .from('file_uploads')
        .select('*')
        .order('uploaded_at', { ascending: false })

      if (error) {
        console.error('Error listing files:', error)
        return { success: false, error: error.message }
      }

      return { success: true, files: data }
    } catch (error) {
      console.error('Error in listUserFiles:', error)
      return { success: false, error: 'Failed to list files' }
    }
  }

  getPublicUrl(fileName: string): string {
    const { data } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(fileName)
    
    return data.publicUrl
  }

  async createSignedUrl(fileName: string, expiresIn: number = 3600): Promise<{
    success: boolean
    signedUrl?: string
    error?: string
  }> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .createSignedUrl(fileName, expiresIn)

      if (error) {
        console.error('Error creating signed URL:', error)
        return { success: false, error: error.message }
      }

      return { success: true, signedUrl: data.signedUrl }
    } catch (error) {
      console.error('Error in createSignedUrl:', error)
      return { success: false, error: 'Failed to create signed URL' }
    }
  }
}

export const supabaseStorageService = new SupabaseStorageService()