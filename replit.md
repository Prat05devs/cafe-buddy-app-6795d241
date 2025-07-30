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
- **Database**: Supabase PostgreSQL with connection pooling (Connected ✅)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: All tables created and ready for use
- **Connection**: postgres-js driver optimized for Supabase
- **Sample Data**: Categories, tables, and menu items populated

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

### Recent Changes (July 2025)
- **✅ Project Migration**: Successfully migrated from Replit Agent to native Replit environment
- **✅ Database Architecture**: Created PostgreSQL database with comprehensive Drizzle ORM schemas
- **✅ Schema Implementation**: Built complete database tables for users, categories, menu_items, tables, orders, and order_items
- **✅ Sample Data**: Populated database with 5 categories, 10 menu items, 8 tables, and 4 users
- **✅ API Endpoints**: Implemented REST API with /api/categories, /api/menu/items, /api/tables, /api/users
- **✅ Frontend Integration**: Updated React Query hooks to fetch data from real database APIs
- **✅ Type Safety**: Ensured consistent TypeScript types between frontend and backend using shared schema
- **✅ Client Architecture**: Maintained Vite + Express setup with proper client/server separation
- **✅ Security**: Implemented secure database connections and validated data structures

### Migration Status - COMPLETE ✅
- **Backend**: ✅ Complete - Express server with PostgreSQL integration working
- **Database**: ✅ Complete - All tables created with sample data
- **API Integration**: ✅ Complete - Frontend successfully fetching real data from database
- **Frontend**: ✅ Complete - React components displaying live database data
- **Security**: ✅ Complete - Proper separation and database security implemented
- **Data Sync**: ✅ Complete - Menu items, categories, tables all syncing properly
- **Website Preview**: ✅ Complete - Restaurant dashboard fully functional with real data

### Verified Working Features
- **Dashboard**: Displays real restaurant statistics and data
- **Menu Display**: All 10 menu items from 5 categories showing correctly
- **Table Management**: 8 tables with proper status tracking
- **Category Navigation**: Categories with icons and proper organization
- **API Endpoints**: All GET endpoints returning authentic database data
- **Real-time Updates**: Frontend properly connected to backend database