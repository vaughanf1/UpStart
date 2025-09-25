# UpStart - AI-Powered Startup Idea Analyzer

UpStart is a comprehensive platform for discovering, submitting, and analyzing startup ideas using AI-powered insights. Built with Next.js, TypeScript, and Claude AI.

## 🚀 Features

- **AI-Powered Analysis**: Get comprehensive startup idea evaluations using Claude AI
- **Interactive Dashboard**: Browse and discover validated startup ideas
- **Detailed Scoring**: Opportunity, feasibility, timing, and problem scores for each idea
- **Comprehensive Reports**: Business fit analysis, revenue potential, and market insights
- **Modern UI**: Clean, responsive design built with Tailwind CSS
- **Real-time Updates**: Live analysis and instant feedback

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Production database
- **Claude AI** - Anthropic's AI for idea analysis

### Deployment
- **Vercel** - Hosting platform
- **Prisma Cloud** - Database hosting

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ installed
- Git installed

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd startup-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env` and update with your values:
   ```env
   DATABASE_URL="your-database-url"
   ANTHROPIC_API_KEY="your-claude-api-key"
   JWT_SECRET="your-jwt-secret"
   NEXTAUTH_SECRET="your-nextauth-secret"
   ```

4. **Set up the database**
   ```bash
   # Start Prisma dev database (local development)
   npx prisma dev

   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev --name init
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment to Vercel

### Prerequisites
- Vercel account
- PostgreSQL database (recommend [Neon](https://neon.tech/) or [PlanetScale](https://planetscale.com/))
- Claude API key from [Anthropic](https://console.anthropic.com/)

### Step-by-step Deployment

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com/)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Set Environment Variables**
   In your Vercel dashboard, add these environment variables:

   ```env
   DATABASE_URL=your-production-database-url
   ANTHROPIC_API_KEY=sk-ant-api03-[your-key]
   JWT_SECRET=your-production-jwt-secret-min-32-chars
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

4. **Deploy**
   - Vercel will automatically deploy your app
   - Your app will be available at `https://your-app.vercel.app`

## 📖 API Endpoints

### Ideas Management
- `GET /api/ideas` - List all ideas with pagination
- `POST /api/ideas` - Create a new idea
- `GET /api/ideas/[id]` - Get specific idea details
- `PUT /api/ideas/[id]` - Update an idea
- `DELETE /api/ideas/[id]` - Delete an idea

### Analysis
- `POST /api/analysis/[ideaId]` - Run AI analysis on an idea
- `GET /api/analysis/[ideaId]` - Get existing analysis results

### Testing
- `POST /api/test-claude` - Test Claude AI integration

## 🎯 How It Works

1. **Submit Ideas**: Users submit startup ideas through the web interface
2. **AI Analysis**: Claude AI analyzes ideas across multiple frameworks:
   - Core scoring (Opportunity, Problem, Feasibility, Why Now)
   - Business fit analysis
   - Revenue potential estimation
   - Go-to-market strategy evaluation
3. **Detailed Reports**: Users receive comprehensive analysis reports
4. **Browse Ideas**: Explore other analyzed ideas for inspiration

## 🔐 Security Notes for Deployment

**Important**: Your Claude API key is included in the `.env` file. For production deployment:

1. **Use Vercel Environment Variables**: Store the API key in Vercel's environment variables
2. **Don't commit `.env` to git**: The `.env` file is already in `.gitignore`
3. **Use different keys**: Use separate API keys for development and production
4. **Monitor usage**: Set up billing alerts for your Claude API usage

---

Built with ❤️ using Claude AI and modern web technologies.
