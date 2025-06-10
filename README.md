# AIVA - AI-Powered Social Media Content Generator

🚀 **AIVA** is a comprehensive SaaS platform that leverages artificial intelligence to generate engaging social media content for businesses across multiple platforms.

## ✨ Features

### 🤖 AI Content Generation
- **Multi-Platform Support**: Generate content for Facebook, Instagram, Twitter, LinkedIn, and TikTok
- **Customizable Tone**: Professional, casual, friendly, enthusiastic, informative, inspiring, or humorous
- **Smart Hashtag Generation**: Platform-specific hashtags automatically generated
- **Brand Voice Integration**: Content tailored to your company's brand voice and target audience

### 🏢 Company Management
- **Multi-Company Support**: Manage multiple businesses from one account
- **Brand Customization**: Set brand colors, voice, and target audience
- **Industry-Specific Content**: Tailored content based on your industry

### 📊 Content Management
- **Draft System**: Save and edit generated content before publishing
- **Content History**: Track all your generated posts
- **Template Library**: Pre-built templates for common post types
- **Analytics Dashboard**: Monitor content performance

### 🔐 Security & Authentication
- **Supabase Authentication**: Secure user registration and login
- **Row-Level Security**: Data isolation between users
- **File Upload Security**: Secure profile picture and asset management

## 🛠️ Tech Stack

- **Frontend**: Vue.js 3 + TypeScript + Vite
- **Styling**: Tailwind CSS + Headless UI
- **State Management**: Pinia
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **AI Integration**: Google Gemini API
- **Icons**: Heroicons
- **Charts**: Chart.js + Vue-ChartJS

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- Google Gemini API key

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd Aiva
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file and configure your credentials:
```bash
cp .env.example .env
```

Update `.env` with your credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
gemini-token=your_gemini_api_key
```

### 4. Database Setup
Run the SQL commands from `SUPABASE_SETUP.md` in your Supabase SQL Editor to set up the database schema and RLS policies.

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 📁 Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── dashboard/       # Dashboard-specific components
│   ├── landing/         # Landing page components
│   └── ui/             # Generic UI components
├── lib/                # Library configurations
│   └── supabase.ts     # Supabase client setup
├── router/             # Vue Router configuration
├── services/           # API and business logic
│   ├── supabase-*.ts   # Supabase service modules
│   └── *.ts           # Other service modules
├── stores/             # Pinia state management
├── types/              # TypeScript type definitions
├── views/              # Page components
│   ├── auth/           # Authentication pages
│   └── dashboard/      # Dashboard pages
└── style.css           # Global styles
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🎯 Usage Guide

### Getting Started
1. **Register/Login**: Create an account or sign in
2. **Create Company**: Set up your business profile with brand details
3. **Generate Content**: Use the AI generation tool to create posts
4. **Customize**: Edit generated content to match your needs
5. **Save/Export**: Save as drafts or export for publishing

### AI Content Generation
1. Navigate to the "Generate Content" section
2. Select your company and target platform
3. Choose post type (promotional, educational, entertainment, etc.)
4. Describe what you want to post about
5. Set tone and style preferences
6. Click "Generate Content" to create AI-powered posts

### Managing Companies
- Add multiple businesses with unique brand profiles
- Set industry, target audience, and brand voice
- Customize brand colors and messaging
- Upload company logos and assets

## 🔐 Security Features

- **Authentication**: Secure user registration and login via Supabase Auth
- **Data Isolation**: Row-Level Security ensures users only access their data
- **File Security**: Secure file uploads with proper access controls
- **Environment Protection**: Sensitive credentials stored in environment variables

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the `SUPABASE_SETUP.md` for database setup instructions
2. Ensure all environment variables are correctly set
3. Verify your Supabase project configuration
4. Check the browser console for any error messages

## 🔮 Roadmap

- [ ] Real-time collaboration features
- [ ] Advanced analytics and insights
- [ ] Social media scheduling integration
- [ ] Multi-language content generation
- [ ] Custom AI model training
- [ ] Team management features
- [ ] API for third-party integrations

---

**Built with ❤️ using Vue.js, Supabase, and AI**