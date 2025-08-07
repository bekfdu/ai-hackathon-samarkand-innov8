# 📚 EduCheck - AI Handwritten Essay Checker

<div align="center">


**Qo'lda yozilgan insholarni AI yordamida tekshiring**

*Tez, aniq va professional tahlil O'zbek, Ingliz, Rus va Turk tillarida*

[🚀 Live Demo](https://t.me/EduCheck_project) | [📖 Documentation](https://t.me/EduCheck_project)

</div>

---

## 🌟 Features

### 🔍 **OCR Text Extraction**
- Advanced handwriting recognition with 95%+ accuracy
- Support for printed and cursive text
- Multi-language detection and processing
- Real-time image preprocessing and optimization

### ✏️ **AI-Powered Grammar Analysis**
- Intelligent grammar and spelling checking
- Context-aware error detection
- Writing style and tone analysis
- Personalized improvement suggestions

### 🌍 **Multi-Language Support**
- **O'zbekcha** (Uzbek) - Native language optimization
- **English** - Full grammar and style analysis
- **Русский** (Russian) - Complete language support  
- **Türkçe** (Turkish) - Native speaker quality checking

### 📱 **Modern Web Experience**
- Built with **Next.js 14** and **React 18**
- **TypeScript** for type safety and developer experience
- **Tailwind CSS** for responsive, mobile-first design
- **Server-side rendering** for optimal performance

### ⚡ **Enterprise-Grade Performance**
- Sub-second page loads with Next.js optimizations
- Edge computing with Vercel deployment
- Automatic image optimization and lazy loading
- Progressive Web App (PWA) capabilities

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn** package manager
- Modern web browser

### 1. **Clone & Install**
```bash
git clone https://github.com/username/educheck.git
cd educheck
npm install
# or
yarn install
```

### 2. **Environment Setup**
```bash
# Copy environment variables
cp .env.example .env.local

# Add your API keys
NEXT_PUBLIC_OCR_API_URL=https://educhecktexttest1111.onrender.com/detect
NEXT_PUBLIC_GRAMMAR_API_URL=https://websocket.tahrirchi.uz/check  
NEXT_PUBLIC_GRAMMAR_API_KEY=your-api-key-here
```

### 3. **Development Server**
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. **Production Build**
```bash
npm run build
npm run start
# or
yarn build
yarn start
```

---

## 📂 Project Structure

```
educheck/
├── 📁 app/                    # Next.js 14 App Router
│   ├── 📄 layout.tsx         # Root layout with providers
│   ├── 📄 page.tsx           # Landing page
│   ├── 📁 upload/            # Upload page route
│   ├── 📁 processing/        # Processing page route  
│   ├── 📁 results/           # Results page route
│   ├── 📁 api/               # API routes
│   │   ├── 📁 ocr/           # OCR endpoint proxy
│   │   └── 📁 grammar/       # Grammar check proxy
│   └── 📄 globals.css        # Global styles
├── 📁 components/            # React components
│   ├── 📁 ui/                # Reusable UI components
│   │   ├── Button.tsx        # Custom button component
│   │   ├── Card.tsx          # Card component
│   │   ├── Toast.tsx         # Notification system
│   │   └── LoadingSpinner.tsx # Loading states
│   ├── FileUploader.tsx      # Drag & drop file upload
│   ├── ProcessingSteps.tsx   # Step-by-step progress
│   ├── ResultsDisplay.tsx    # Analysis results UI
│   └── LanguageSelector.tsx  # Multi-language picker
├── 📁 lib/                   # Utility libraries
│   ├── 📄 api.ts            # API integration functions
│   ├── 📄 types.ts          # TypeScript type definitions
│   ├── 📄 utils.ts          # Helper utilities
│   └── 📄 constants.ts      # App constants
├── 📁 hooks/                 # Custom React hooks
│   ├── useOCR.ts            # OCR processing hook
│   ├── useGrammarCheck.ts   # Grammar analysis hook
│   └── useLocalStorage.ts   # Local storage management
├── 📁 public/                # Static assets
│   ├── 📁 icons/            # App icons and favicons
│   └── 📁 images/           # Static images
├── 📄 next.config.js        # Next.js configuration
├── 📄 tailwind.config.js    # Tailwind CSS config
├── 📄 tsconfig.json         # TypeScript configuration
└── 📄 package.json          # Dependencies and scripts
```

---

## 🔌 API Integration

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_OCR_API_URL=https://educhecktexttest1111.onrender.com/detect
NEXT_PUBLIC_GRAMMAR_API_URL=https://websocket.tahrirchi.uz/check
NEXT_PUBLIC_GRAMMAR_API_KEY=th_2d2be2a9-4bb5-4df7-9140-e061739f678c
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### OCR Service Integration
```typescript
// lib/api.ts
interface OCRResponse {
  success: boolean;
  text: string;
  confidence: number;
  language: string;
  processingTime: number;
}

export async function extractTextFromImage(file: File): Promise<OCRResponse> {
  const base64 = await fileToBase64(file);
  
  const response = await fetch('/api/ocr', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_base64: base64.split(',')[1] })
  });
  
  return await response.json();
}
```

### Grammar Check Integration
```typescript
// lib/api.ts
interface GrammarResponse {
  success: boolean;
  score: number;
  errors: GrammarError[];
  statistics: AnalysisStatistics;
  feedback: string;
}

export async function checkGrammar(text: string): Promise<GrammarResponse> {
  const response = await fetch('/api/grammar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  
  return await response.json();
}
```

---

## 🛠️ Tech Stack

### **Frontend Framework**
- **Next.js 14** - Full-stack React framework with App Router
- **React 18** - Latest React with Concurrent Features
- **TypeScript 5.0** - Type-safe development experience

### **Styling & UI**
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful & consistent icons
- **CSS Modules** - Component-scoped styling
- **Responsive Design** - Mobile-first approach

### **State Management**
- **React Hooks** - Built-in state management
- **Context API** - Global state sharing
- **Local Storage** - Client-side persistence

### **Development & Build**
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Husky** - Git hooks for code quality
- **Turbopack** - Fast bundler for development

### **Deployment & Hosting**
- **Vercel** - Serverless deployment platform
- **Edge Functions** - API routes with global distribution
- **CDN** - Automatic asset optimization

---



---

## 🧪 Development & Testing

### Available Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build", 
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "e2e": "playwright test"
  }
}
```

### Code Quality Tools
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Testing
npm run test

# E2E testing  
npm run e2e
```

### Development Workflow
1. **Create feature branch**: `git checkout -b feature/new-feature`
2. **Make changes** with TypeScript and proper typing
3. **Test locally**: `npm run dev`
4. **Run tests**: `npm run test`
5. **Type check**: `npm run type-check`
6. **Commit**: Follow conventional commits
7. **Push & create PR**

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### Manual Deployment
```bash
# Build the application
npm run build

# Export static files (if needed)
npm run export

# Deploy dist/ folder to any hosting service
```

### Environment Variables on Vercel
Set these in your Vercel dashboard:
- `NEXT_PUBLIC_OCR_API_URL`
- `NEXT_PUBLIC_GRAMMAR_API_URL` 
- `NEXT_PUBLIC_GRAMMAR_API_KEY`

---

## 📈 Roadmap & Features

### ✅ **Phase 1: Core MVP (Completed)**
- [x] Next.js 14 with TypeScript setup
- [x] OCR text extraction integration
- [x] Grammar checking with AI
- [x] Mobile-responsive design  
- [x] Multi-language support (UZ/EN/RU/TR)
- [x] Real-time processing feedback

### 🚧 **Phase 2: Enhanced UX (In Progress)**
- [ ] Dark/Light theme toggle
- [ ] Advanced error highlighting
- [ ] PDF report generation
- [ ] Results sharing functionality
- [ ] Processing history
- [ ] User preferences storage

### 📋 **Phase 3: Advanced Features (Planned)**
- [ ] User authentication (NextAuth.js)
- [ ] Plagiarism detection
- [ ] Batch processing
- [ ] Teacher dashboard
- [ ] Student progress tracking
- [ ] API rate limiting

### 🎯 **Phase 4: Enterprise (Future)**
- [ ] Multi-tenant architecture
- [ ] School management system
- [ ] Analytics dashboard
- [ ] White-label solution
- [ ] Mobile apps (React Native)



<div align="center">

### 🚀 Ready to transform handwritten essay checking?

[**Try EduCheck Live**](https://educheck.vercel.app) | [**View on GitHub**](https://github.com/username/educheck) | [**Deploy Your Own**](https://vercel.com/new/clone?repository-url=https://github.com/username/educheck)

*Made with ❤️ for Uzbek students, teachers, and educational institutions*

</div>
