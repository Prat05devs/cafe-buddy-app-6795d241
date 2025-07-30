# Restaurant POS System - Architecture Overview

## Overview

This is a modern, full-stack restaurant point-of-sale (POS) system built with React, Express, and PostgreSQL. The application features a comprehensive dashboard for restaurant management including menu management, order processing, table management, and sales reporting. The system is designed with a modern glassmorphic UI theme and supports multilingual capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture (Next.js)
- **Framework**: Next.js 14 with App Router and TypeScript
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom design tokens for glassmorphic theme
- **State Management**: Zustand for client state, TanStack Query for server state
- **Authentication**: JWT-based with persistent auth store
- **API Integration**: Axios client with interceptors for error handling

### Backend Architecture (Node.js/Express)
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript throughout the stack
- **Architecture**: Clean architecture with controllers, services, models
- **API Structure**: REST API with `/api/v1` prefix
- **Authentication**: JWT with role-based access control
- **Error Handling**: Centralized error middleware with custom error classes
- **Validation**: Zod schemas for request/response validation
- **Security**: Helmet, CORS, rate limiting

### Database Architecture (Supabase PostgreSQL)
- **Database**: Supabase PostgreSQL with connection pooling
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle migrations in `/backend/migrations` directory
- **Connection**: Neon serverless driver for PostgreSQL

## Key Components

### Application Structure
```
├── frontend/        # Next.js frontend application
│   ├── src/
│   │   ├── app/     # Next.js App Router pages
│   │   ├── components/  # React components by feature
│   │   ├── lib/     # Utilities, API clients, stores
│   │   ├── types/   # TypeScript definitions
│   │   └── styles/  # Global styles and themes
├── backend/         # Node.js Express API
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── services/     # Business logic
│   │   ├── models/       # Database schemas
│   │   ├── routes/       # API route definitions
│   │   ├── middleware/   # Express middleware
│   │   └── config/       # Configuration files
│   └── migrations/  # Database migration files
├── shared/          # Shared types and constants
└── docs/           # Documentation
```

### Core Features
1. **Dashboard**: Real-time statistics, recent orders, and top-selling items
2. **Menu Management**: CRUD operations for menu items and categories
3. **Order Management**: Order creation, status tracking, and fulfillment
4. **Table Management**: Table status tracking and reservation system
5. **Reports**: Sales analytics and business intelligence
6. **Settings**: Restaurant configuration and preferences

### UI Components
- **Design System**: Custom glassmorphic theme with orange accent colors
- **Component Library**: Comprehensive set of reusable UI components
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Theme Support**: Light/dark/auto theme switching capability

## Data Flow

### Client-Server Communication
1. Frontend makes HTTP requests to Express server
2. Server processes requests using storage interface
3. Currently uses in-memory storage (MemStorage class)
4. Database integration ready via Drizzle ORM setup

### State Management Flow
1. **Global State**: Restaurant context provides centralized data management
2. **Local State**: Component-level state for UI interactions
3. **Server State**: TanStack Query manages API data fetching and caching
4. **Theme State**: Separate context for theme management

### Data Models
- **Users**: Basic user authentication schema
- **Menu Items**: Products with categories, pricing, and availability
- **Orders**: Order tracking with items, status, and customer info
- **Tables**: Table management with capacity and status
- **Categories**: Menu organization and display order

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **drizzle-kit**: Database schema management and migrations

### UI Enhancement
- **framer-motion**: Animation library for smooth transitions
- **date-fns**: Date manipulation and formatting
- **lucide-react**: Icon library for consistent iconography

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations handle schema updates

### Environment Setup
- **Development**: Hot reload with tsx and Vite dev server
- **Production**: Node.js serves bundled application
- **Database**: PostgreSQL connection via environment variable

### Configuration Management
- **Restaurant Config**: Centralized configuration system
- **Feature Flags**: Conditional feature enablement
- **Multilingual Support**: Localized text management
- **Theme Customization**: CSS custom properties for theming

### Recent Changes (Jan 2025)
- **✅ Complete folder restructure**: Migrated from hybrid React/Vite structure to modern Next.js + Express separation
- **✅ Backend architecture**: Implemented clean architecture with controllers, services, models, and middleware
- **✅ Database models**: Created comprehensive Drizzle schemas for all entities (users, menu, orders, tables, categories)
- **✅ API layer**: Built complete REST API with JWT authentication and role-based access control
- **✅ Frontend foundation**: Set up Next.js App Router with proper TypeScript configuration
- **✅ State management**: Implemented Zustand stores and TanStack Query for data fetching
- **⏳ Component migration**: Currently migrating existing React components to new Next.js structure
- **⏳ Database setup**: Ready for Supabase PostgreSQL integration

### Migration Status
- **Backend**: 95% complete - All core infrastructure ready
- **Frontend**: 30% complete - Base architecture and auth system ready
- **Database**: Ready for connection - Models and migrations prepared
- **API Integration**: 80% complete - Client setup with authentication flow