# RealArtist AI Platform

## Overview

RealArtist AI is a full-stack web application for AI-powered music creation. The platform allows users to input lyrics and generate complete songs with AI vocals, instrumentals, and potentially music videos. Built with modern web technologies, it features a React frontend, Express backend, and PostgreSQL database with Drizzle ORM.
Copyright (c) 2025 ervin remus radosavlevici. All Rights Reserved.
## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom design tokens and dark mode support
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API with structured error handling
- **File Serving**: Static file serving with Vite integration in development

### Database Architecture
- **Database**: PostgreSQL (configured via Replit modules)
- **ORM**: Drizzle ORM with Zod schema validation
- **Connection**: Neon Database serverless driver
- **Schema**: Centralized schema definition in `/shared/schema.ts`

## Key Components

### Database Schema
The application uses four main tables:
- **users**: User profiles with authentication data and account types
- **projects**: Music creation projects with lyrics, metadata, and generation status
- **aiArtists**: Available AI voice artists with descriptions and voice types
- **userStats**: User statistics including songs created, streams, and AI credits

### API Endpoints
- `GET /api/user` - Get current user profile
- `GET /api/user/stats` - Get user statistics and credits
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get specific project
- `PATCH /api/projects/:id` - Update project
- `GET /api/ai-artists` - List available AI artists

### Core Features
1. **Lyrics Input & Analysis**: Text analysis with word/line counting and duration estimation
2. **AI Artist Selection**: Choose from different AI voice types (pop, hip-hop, R&B, etc.)
3. **Music Generation Pipeline**: Multi-step workflow from lyrics to complete song
4. **Project Management**: Save, track, and manage music creation projects
5. **User Statistics**: Credits tracking and usage analytics

## Data Flow

1. **User Input**: User enters lyrics and selects mood, genre, tempo, and AI artist
2. **Project Creation**: System creates project record with initial metadata
3. **AI Processing Pipeline**:
   - Script generation from lyrics
   - Voice synthesis with selected AI artist
   - Instrumental composition
   - Final audio mixing
4. **Progress Tracking**: Real-time updates on generation status
5. **Result Delivery**: Completed song available for playback and download

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React with Radix UI components
- **HTTP Client**: Native fetch API with TanStack Query
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React icons
- **Date Handling**: date-fns library
- **Carousel**: Embla Carousel for UI components

### Backend Dependencies
- **Database**: Neon Database serverless PostgreSQL
- **ORM**: Drizzle ORM with PostgreSQL adapter
- **Session Management**: connect-pg-simple for PostgreSQL session store
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Build System**: Vite with React plugin
- **TypeScript**: Full type safety across frontend and backend
- **Linting**: ESLint and TypeScript compiler checks
- **Development Server**: Hot reload with Vite middleware

## Deployment Strategy

### Development Environment
- **Runtime**: Replit with Node.js 20, PostgreSQL 16 modules
- **Development Server**: `npm run dev` runs backend with Vite middleware
- **Hot Reload**: Vite handles frontend updates, tsx watches backend changes
- **Database**: Drizzle migrations with `npm run db:push`

### Production Build
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Deployment**: Replit Autoscale deployment target
- **Static Assets**: Express serves built frontend from `/dist/public`

### Environment Configuration
- **Database**: `DATABASE_URL` environment variable for PostgreSQL connection
- **Development**: NODE_ENV detection for development-specific features
- **Port Configuration**: Server runs on port 5000 with external port 80

## Changelog
```
Changelog:
- January 18, 2025: Production-ready platform completed with full business features
  * Added comprehensive project vault with filtering and search
  * Implemented analytics dashboard with real-time charts and metrics
  * Built royalty management system with collaborator tracking
  * Created advanced security center with theft detection
  * Added professional business licensing and legal documentation
  * Completed production deployment configuration with Docker support
  * Enhanced database schema with extended project metadata and tracking
  * Integrated comprehensive documentation and deployment guides
- June 18, 2025: Initial setup
```

## Production Features Completed
```
✅ Core AI Music Pipeline: Lyrics → Script → Voice → Music → Video → Bundle
✅ Professional Dashboard: Complete production studio interface
✅ Project Vault: Advanced project management with filtering and analytics
✅ Analytics Dashboard: Real-time streaming data, revenue tracking, geographic insights
✅ Royalty Management: Collaborator tracking, contract management, payment history
✅ Security Center: Theft detection, device management, activity monitoring
✅ Business Licensing: Professional legal framework with usage rights
✅ Production Deployment: Docker, environment configs, scaling guides
✅ Documentation: Complete README, deployment guide, changelog
✅ Database Schema: Extended with content protection, royalty tracking, security logs
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
Build preferences: Production-ready features with comprehensive business functionality.
```