import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Check if the URL is still a placeholder
if (supabaseUrl.includes('your-project-id') || supabaseUrl === 'your_supabase_project_url_here') {
  throw new Error('Please replace the placeholder Supabase URL with your actual project URL in the .env file.')
}

// Check if the key is still a placeholder
if (supabaseAnonKey.includes('your-anon-key') || supabaseAnonKey === 'your_supabase_anon_key_here') {
  throw new Error('Please replace the placeholder Supabase anonymous key with your actual key in the .env file.')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})