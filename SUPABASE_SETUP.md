# Supabase Integration Setup Guide

This guide will help you set up Supabase integration for the Aiva social media management application.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. The Aiva application codebase

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter a project name (e.g., "aiva-social-media")
5. Enter a database password (save this securely)
6. Select a region close to your users
7. Click "Create new project"

## Step 2: Set Up Database Schema

Run the following SQL commands in your Supabase SQL Editor:

```sql
-- Note: auth.users table already has RLS enabled by default in Supabase
-- We don't need to modify the auth.users table directly

-- Create users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  avatar TEXT,
  subscription TEXT DEFAULT 'free' CHECK (subscription IN ('free', 'starter', 'professional', 'enterprise')),
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create companies table
CREATE TABLE public.companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT,
  logo TEXT,
  website TEXT,
  phone TEXT,
  address TEXT,
  social_media JSONB DEFAULT '{}',
  brand_colors JSONB DEFAULT '{}',
  brand_voice TEXT DEFAULT 'professional' CHECK (brand_voice IN ('professional', 'casual', 'friendly', 'authoritative', 'creative')),
  target_audience TEXT,
  products TEXT,
  unique_selling_points TEXT,
  preferred_platforms TEXT[],
  content_themes TEXT,
  brand_guidelines TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create social_posts table
CREATE TABLE public.social_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'instagram', 'twitter', 'linkedin', 'tiktok')),
  post_type TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  hashtags TEXT[],
  mentions TEXT[],
  media_urls TEXT[],
  ai_prompt TEXT,
  engagement_stats JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create post_templates table
CREATE TABLE public.post_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  platform TEXT NOT NULL,
  post_type TEXT NOT NULL,
  hashtags TEXT[],
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create file_uploads table
CREATE TABLE public.file_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_companies_user_id ON public.companies(user_id);
CREATE INDEX idx_social_posts_user_id ON public.social_posts(user_id);
CREATE INDEX idx_social_posts_company_id ON public.social_posts(company_id);
CREATE INDEX idx_social_posts_status ON public.social_posts(status);
CREATE INDEX idx_social_posts_scheduled_for ON public.social_posts(scheduled_for);
CREATE INDEX idx_post_templates_user_id ON public.post_templates(user_id);
CREATE INDEX idx_post_templates_company_id ON public.post_templates(company_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- Set up Row Level Security policies

-- Users can only see and edit their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Companies policies
CREATE POLICY "Users can view own companies" ON public.companies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create companies" ON public.companies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own companies" ON public.companies
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own companies" ON public.companies
  FOR DELETE USING (auth.uid() = user_id);

-- Social posts policies
CREATE POLICY "Users can view own posts" ON public.social_posts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create posts" ON public.social_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON public.social_posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON public.social_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Post templates policies
CREATE POLICY "Users can view own templates" ON public.post_templates
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create templates" ON public.post_templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates" ON public.post_templates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates" ON public.post_templates
  FOR DELETE USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

-- File uploads policies
CREATE POLICY "Authenticated users can upload files" ON public.file_uploads
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view files" ON public.file_uploads
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete files" ON public.file_uploads
  FOR DELETE USING (auth.role() = 'authenticated');

-- Enable RLS on all tables (auth.users already has RLS enabled by default)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_posts_updated_at
  BEFORE UPDATE ON public.social_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_post_templates_updated_at
  BEFORE UPDATE ON public.post_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

## Step 3: Set Up Storage

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called "uploads"
3. Set the bucket to "Public" if you want direct access to uploaded files
4. Configure the following policies for the uploads bucket:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files" ON storage.objects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to view files
CREATE POLICY "Anyone can view files" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);
```

## Step 4: Configure Environment Variables

1. Copy your Supabase project URL and anon key from the API settings
2. Update the `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_BASE_URL=http://localhost:3001/api
VITE_DEV_MODE=true
```

**Important:** You MUST replace the placeholder values with your actual Supabase credentials:

1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the "Project URL" and replace `https://your-project-id.supabase.co`
4. Copy the "anon public" key and replace `your-anon-key-here`

**Note:** The application will show an error if you don't replace these placeholder values.

## Step 5: Install Dependencies

The Supabase client is already installed. If you need to reinstall:

```bash
npm install @supabase/supabase-js
```

## Step 6: Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Try registering a new user
3. Create a company profile
4. Generate and save a social media post
5. Check that data appears in your Supabase dashboard

## Features Included

### Authentication
- User registration and login
- Password reset
- User profile management
- Session management

### Data Management
- Companies (profiles, branding, settings)
- Social media posts (creation, scheduling, publishing)
- Post templates
- File uploads (logos, images)
- Notifications

### Subscription Management
- Tier-based feature access
- Usage tracking
- Limit enforcement

### Real-time Features
- Live notifications
- Real-time data updates

## Security Features

- Row Level Security (RLS) enabled
- User data isolation
- Secure file uploads
- API key protection

## Troubleshooting

### Common Issues

1. **"must be owner of table users" error**
   - This occurs when trying to modify the `auth.users` table directly
   - The `auth.users` table is managed by Supabase and cannot be modified
   - Solution: Only modify tables in the `public` schema, never the `auth` schema
   - The setup guide has been updated to avoid this issue

2. **"Invalid API key" error**
   - Check that your `.env` file has the correct Supabase URL and anon key
   - Ensure the `.env` file is in the project root

3. **"Table doesn't exist" error**
   - Make sure you've run all the SQL commands in Step 2
   - Check that the tables are created in the "public" schema

4. **"Permission denied" error**
   - Verify that Row Level Security policies are set up correctly
   - Check that the user is authenticated
   - Ensure you're not trying to modify system tables

5. **File upload issues**
   - Ensure the "uploads" bucket is created
   - Check storage policies are configured
   - Verify file size limits

### Getting Help

- Check the [Supabase documentation](https://supabase.com/docs)
- Visit the [Supabase community](https://github.com/supabase/supabase/discussions)
- Review the application logs in the browser console

## Next Steps

After setting up Supabase:

1. Configure social media API integrations
2. Set up email notifications
3. Implement analytics tracking
4. Add payment processing for subscriptions
5. Deploy to production

---

**Note**: Remember to keep your Supabase credentials secure and never commit them to version control. Use environment variables for all sensitive configuration.